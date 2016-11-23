#!/usr/bin/env bash

# REQUIRE INPUT ENV
#   GIT_REPO

APP_NAME=webapp
APP_HOME=/home/app
APP_DIR=${APP_HOME}/${APP_NAME}

cat << EOF > /etc/nginx/main.d/app_env.conf
ENV.map do |k, v|
  puts "env #{k};"
end
EOF

cd $APP_HOME

if [[ -d $APP_DIR/.git ]]; then
  echo "webapp already exist"
else
  git clone $GIT_REPO $APP_NAME
fi

chown -R app:app $APP_DIR

cd $APP_DIR
su - app -c "cd $APP_DIR; npm install"
