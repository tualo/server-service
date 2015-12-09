Ext.define('Tualo.GlyphTool', {
    extend: 'Ext.Component',
    alias: 'widget.glyphtool',
    ariaRole: 'button',
    glyphPrefix: 'fa fa-',
    initComponent: function() {
      var me = this;
      me.callParent();
      me.html = '<i unselectable="unselectable" class="'+me.glyphPrefix+me.glyph+'"></i>&nbsp;';
    },
    // inherit docs
    afterRender: function() {
        var me = this,
            tip;

        me.callParent(arguments);

        me.el.on({
          click: me.onClick,
          mousedown: me.onMouseDown,
          mouseover: me.onMouseOver,
          mouseout: me.onMouseOut,
          scope: me
        });
        this.el.setStyle('opacity',"0.5");
        this.el.setStyle('font-size',"1.5em");
        tip = me.tooltip;
        if (tip) {
            me.setTooltip(tip);
        }
    },

    tipAttrs: {
        qtip: 'data-qtip'
    },

    setTooltip: function (tooltip, type) {
        var me = this,
            oldTip = me.tooltip,
            oldType = me.tooltipType,
            id = me.id,
            el = me.el,
            attr;

        if (oldTip && Ext.quickTipsActive && Ext.isObject(oldTip)) {
            Ext.tip.QuickTipManager.unregister(id);
        }

        me.tooltip = tooltip;
        if (type) {
            me.tooltipType = type;
        }

        if (tooltip) {
            if (Ext.quickTipsActive && Ext.isObject(tooltip)) {
                Ext.tip.QuickTipManager.register(Ext.apply({
                    target: id
                }, tooltip));
            } else if (el) {
                if (type && oldType && type !== oldType) {
                    attr = me.tipAttrs[oldType] || 'title';
                    el.dom.removeAttribute(attr);
                }

                attr = me.tipAttrs[type || oldType] || 'title';
                el.dom.setAttribute(attr, tooltip);
            }

            if (attr !== 'title' && me.ariaRole && me.ariaRole !== 'presentation') {
                if (el) {
                    el.dom.setAttribute('aria-label', tooltip);
                }
                else {
                    me.ariaRenderAttributes = me.ariaRenderAttributes || {};
                    me.ariaRenderAttributes['aria-label'] = tooltip;
                }
            }
        }
    },

    privates: {
        getFocusEl: function () {
            return this.el;
        },

        /**
         * Called when the tool element is clicked
         * @private
         * @param {Ext.event.Event} e
         * @param {HTMLElement} target The target element
         */
        onClick: function(e, target) {
            var me = this;

            if (me.disabled) {
                return false;
            }

            //remove the pressed + over class
            me.el.removeCls(me.toolPressedCls + ' ' + me.toolOverCls);

            if (me.stopEvent !== false) {
                e.stopEvent();
            }

            if (me.handler) {
                Ext.callback(me.handler, me.scope, [e, target, me.ownerCt, me], 0, me);
            } else if (me.callback) {
                Ext.callback(me.callback, me.scope, [me.toolOwner || me.ownerCt, me, e], 0, me);
            }

            /**
             * @event click
             * Fires when the tool is clicked
             * @param {Ext.panel.Tool} this
             * @param {Ext.event.Event} e The event object
             * @param {Ext.Component} owner The logical owner of the tool. In a typical
             * `Ext.panel.Panel`, this is set to the owning panel. This value comes from the
             * `toolOwner` config. ** Added in v5.0 **
             */
            me.fireEvent('click', me, e, me.toolOwner || me.ownerCt);

            return true;
        },

        /**
         * Called when the user presses their mouse button down on a tool
         * Adds the press class ({@link #toolPressedCls})
         * @private
         */
        onMouseDown: function() {
            if (this.disabled) {
                return false;
            }

            this.el.addCls(this.toolPressedCls);
        },

        /**
         * Called when the user rolls over a tool
         * Adds the over class ({@link #toolOverCls})
         * @private
         */
        onMouseOver: function() {
            if (this.disabled) {
                return false;
            }
            this.el.setStyle('opacity',"1");
            this.el.addCls(this.toolOverCls);
        },

        /**
         * Called when the user rolls out from a tool.
         * Removes the over class ({@link #toolOverCls})
         * @private
         */
        onMouseOut: function() {
          this.el.setStyle('opacity',"0.5");
          this.el.removeCls(this.toolOverCls);
        }
    }

});
