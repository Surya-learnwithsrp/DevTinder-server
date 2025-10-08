## Auth api
/signup
/login
/logout


## Profile api
/profile
/profile/update
/profile/update/password

## Request api
/request/send/:status/:toUserId
/request/review/:status/:requestId

## User api
/user/requests/received
/user/connections
/feed

## Deployment steps in AWS

Sign up with AWS create a new account
Search EC2 instance and create a new instance by using default options, choose ubantu OS for server
Click create instance, wait until status checks is fully passed.
Connect to the remote system using SSH client method - `chmod 400 "devTinder-secret.pem"`
Then connect to your remote system using SSH secret key with instance name - `ssh -i "devTinder-secret.pem" ubuntu@ec2-3-80-74-91.compute-1.amazonaws.com`

Once you enter into the remote system you need to install node there and manage node  version also that project uses.
Then clone the github projects which is pushed for DevTinder both web and server

- Frontend deployment (In remote system)
   1. Install dependencies - `npm install`
   2. Build your react app - `npm run build`
   3. `sudo apt update` - to update the remote system
   4. `sudo apt install nginx`
   5. `sudo systemctl start nginx`
   6. `sudo systemctl enable nginx`
   7. Now we need to copy dist(build files) to nginx path /var/www/html/ - `sudo scp -r dist/* /var/www/html/`
   8. verify in this path `/var/www/html/` whether the copied files are present in this folder.
   9. Enable port :80 which default port in nginx foe your instance
   10. Security -> security groups -> edit inbound rules -> add new rule -> { type: HTTP, protocal: TCP, port: 80, source:  
0.0.0.0/0 }
   11. Now copy the public address in your instance run it on web - Frontend load on the server 

- Backend deployment (in remote system, inside DevTinder-server folder only to run backend)
    1. Install dependencies - `npm install`
    2. Run backend app - `npm start` (In production we use npm start not npm run dev)
    3. If your DB is not connected you have to give access to DB where it can access it from anywhere IP address. So add the Public ip address if this instance to the DB.
    4. Then set the port :7777 to security groups inbound rules.
    5. Load the https://publicIp:7777 - backend app will start
    6. Once we exit from remote system out backend server will stop. To run 24/7 we can use PM2 package to run backend server 24/7.
    7. Install pm2 package globally npm `install pm2 -g` in remote system and then run `pm2 start npm -- start`
    8. To check the logs - `pm2 logs`
    9. To flush the logs - `pm2 flush <name>` => <name> is the name of the server
    10. To check the list of servers - `pm2 list`
    11. To stop and delete the list in pm2  - `pm2 stop <name>` and `pm2 delete <name>`
    12. To add a custom name to pm2 list name - `pm2 start npm --name "devTinderBackend" -- start`
    13. Now we have connect both frontend and backend together to run a website.
    14. setup public ip to server_name and write rules to proxy pass in nginx conf file. - `sudo nano /etc/nginx/sites-available/default`
        # Nginx Config
        Editor will open in terminal to edit nginx conf file.
        `server_name <PublicIpaddress>`

        `location /api/` {
            `proxy_pass http://localhost:7777/;`  # Pass the request to the Node.js app
            `proxy_http_version 1.1;`
            `proxy_set_header Upgrade $http_upgrade;`
            `proxy_set_header Connection 'upgrade';`
            `proxy_set_header Host $host;`
            `proxy_cache_bypass $http_upgrade;`
        }
    15. Then restart nginx - `sudo systemctl restart nginx`
    16. Modify BASE_URL = 'https://localhost:7777' to '/api' in frontend and push it to github and remote system.



