#! /bin/sh

PACKAGE_MANAGER = "apt-get"
NODE_DOWNLOAD_URL = "https://nodejs.org/current/node.tgz"
PYLON_DOWNLOAD_URL = "https://baslerweb.com/downloads/pylon.tgz"


echo "Gib das absolute Bildverzeichnis mit Slash am Ende an:"
echo "Bildverzeichnis:"
read GRAB_PATH
echo "Das Bildverzeichnis wird: $GRAB_PATH"

echo "Gib die URL zum ERP an:"
echo "URL:"
read ERP_URL
echo "Die URL wird: $ERP_URL"

echo "Gib ein Mandanten für das ERP an:"
echo "Mandant:"
read ERP_CLIENT
echo "Der Mandant wird: $ERP_CLIENT"

echo "Gib ein Login für das ERP an:"
echo "Login:"
read ERP_LOGIN
echo "Das Login wird: $ERP_LOGIN"

echo "Gib ein Passwort für das ERP an:"
echo "Passwort:"
read ERP_PASSWORD
echo "Das Passwort wird: ***"


# Installation aller grundlegenden Programme
apt-get install --force-yes \
  git \
  build-essentials \
  libcv-dev \
  libcvaux-dev \
  libhighgui-dev \
  libopencv-dev \
  libleptonica-dev \
  libtesseract-dev \
  libzbar-dev \
  tesseract-ocr \
  tesseract-ocr-deu \
  tesseract-ocr-osd \
  zbar-tools \
  exact-image \
  mariadb


# setting up the local database
mysql -u root -p -c "create database sorter"
mysql -u root -p -c "grant all on sorter.* to 'sorter'@'localhost' identified by 'sorter'"
mysql -u sorter -psorter sorter -c "create table ocrhash(id integer primary key)"
mysql -u sorter -psorter sorter -c "create table fast_access_tour(id integer primary key)"

# download and install node
wget --output-document=current.node.tgz $NODE_DOWNLOAD_URL
tar xzf current.node.tgz
cp -R current.node/* /usr/bin

# download and install pylon
wget --output-document=pylon.tgz $PYLON_DOWNLOAD_URL
tar xzf pylon
tar xzf pylon/pylon4.sdk.tgz
cp -R pylon/pylon4/* /opt


# install all node packages
npm install node-gyp -g
npm install bower -g
npm install ocrservice -g
npm install erp-service -g
npm install https://github.com/tualo/server-service.git -g


# install and compile grab
git clone https://github.com/tualo/grab.git
cd grab
sh build
make install
cd ..

# setup capturing service
sed -e "s/jondoe/root/g" grab/grab-service > /etc/init.d/grab-service
chmod a+x /etc/init.d/grab-service
update-rc.d grab-service defaults

# setup ocr service
sed -e "s/jondoe/root/g" /usr/lib/node_modules/ocrservice/service/ocrservice > /etc/init.d/ocrservice
sed -i -e "s/erpclient/$ERP_CLIENT/g" /etc/init.d/ocrservice
sed -i -e "s/erplogin/$ERP_LOGIN/g" /etc/init.d/ocrservice
sed -i -e "s/erppass/$ERP_PASSWORD/g" /etc/init.d/ocrservice
chmod a+x /etc/init.d/ocrservice
update-rc.d ocrservice defaults

# setup erp service
sed -e "s/jondoe/root/g" /usr/lib/node_modules/erp-service/service/erp-service > /etc/init.d/erp-service
sed -i -e "s/erpurl/$ERP_URL/g" /etc/init.d/erp-service
chmod a+x /etc/init.d/erp-service
update-rc.d erp-service defaults

# setup server service
sed -e "s/jondoe/root/g" /usr/lib/node_modules/server-service/service/server-service > /etc/init.d/server-service
chmod a+x /etc/init.d/server-service
update-rc.d server-service defaults
