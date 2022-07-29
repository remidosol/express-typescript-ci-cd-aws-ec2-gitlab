# Express & TypeScript Demo Project for CI/CD Pipeline between GitLab and AWS EC2

This template project is created for implementation of CI/CD Pipeline between GitLab and AWS EC2.

Techs I used in AWS Linux 2: Nginx, PM2

Shall we review [`.gitlab-ci.yml`](./.gitlab-ci.yml) file?

## Review of `.gitlab-ci.yml`

```yml
stages: #1
  - build-deploy #2

build-deploy: #3
  stage: build-deploy #4
  image: alpine:latest #5
  script: #6
    - chmod og= $SSH_PRIVATE_KEY #7
    - apk update && apk add openssh-client #8
    - ssh -i $SSH_PRIVATE_KEY -o StrictHostKeyChecking=no  $STAGE_SERVER_USER@$STAGE_SERVER_IP "sh $CI_SCRIPT_PATH" #9
```
#### #1 and #2
- We have to declare the jobs that will be running under the `stages` field.
- There were build and deploy stages but I decided to one job is enough
- Then I created a sh script as [`follows`](#shScript).

#### #3: We define the jobs that we already declared like that.

#### #4: We specify stage name again.

#### #5
- We specify the Docker image that will be running to execute our scripts.
- I came across the usage of alpine image, there were ssh executions in the example of .gitlab-ci.yml file that's why I choosed it.
- There are many images in hub.docker.com for many of usage.

#### #6
- This part is most important part for me. Because, the scripts that we want to execute when pipeline is triggered place under of this field.

#### #7
- Remove the read, write, and execute permission for all users except the `SSH_PRIVATE_KEY file variable`’s owner.
- `SSH_PRIVATE_KEY file variable` is our private ssh key that have been added in `GitLab repo > Settings > CI/CD` to connect AWS EC2 instance (idk that is whether the best practice or not).

#### #8
- We update alpine
- We install openssh

#### #9
- Then we execute ssh command that executes sh script in remote server.

<details id="shScript">
  <summary>SH Script</summary>

#### If you use it, please consider to change paths :)
```sh
#! /bin/sh
# change directory as project folder
cd /home/user/your/project/path
# stop web server
sudo systemctl stop nginx
pm2 stop 0
# pull differences (https://stackoverflow.com/a/4565746/8935402)
ssh-agent bash -c 'ssh-add /home/user/ssh/path; git pull git@gitlab.com:your/gitlab-repo.git'
# install dependencies
npm i --production
# build project
npm run build
# start web server
sudo systemctl start nginx
pm2 start 0
```
</details>

After build process, there would be a folder named `dist`. This is output directory that would be created as consequence of compiling app.ts file to app.js file. In addition, there would be a [`html`](./index.html) file too.

<details>
  <summary>For the enthusiasts :)</summary>

#### If you use it, please consider to change paths :)
```sh
# NGINX INSTALL (https://www.nginx.com/blog/setting-up-nginx/#install-nginx)

# NGINX CONFIGURATION (https://dev.to/romainlanz/deploy-your-adonis-website-17ec)
# sudo vim /etc/nginx/conf.d/your-ipv4-dns.conf

# server {
  # listen 80 default_server;
  # listen [::]:80 default_server;

  # server_name your-ipv4-dns;

  # location / {
    # proxy_pass http://0.0.0.0:8080;
    # proxy_http_version 1.1;
    # proxy_set_header Connection "upgrade";
    # proxy_set_header Host $host;
    # proxy_set_header Upgrade $http_upgrade;
    # proxy_set_header X-Real-IP $remote_addr;
    # proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  # }
# }
```
</details>
