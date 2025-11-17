# Backend

## module that you need to install
- npm install express pg  dotenv @supabase/supabase-js bcrypt jsonwebtoken cors
- npm install
- npm install axios
- npm install react-router-dom (only if navigating from one page is needed)

## How to push to github
1. git status
    - See what’s changed, what’s staged

2. git add .
    - Add the files you changed (or all)

3. git commit -m "Describe what you changed"
    - Commit with a meaningful message

4. git remote -v
    - Make sure your local repo is linked to the correct remote (the GitHub repo).
    ### Example
    - origin  https://github.com/MuhupuaKamaii/M-and-E-system.git (fetch)
    - origin  https://github.com/MuhupuaKamaii/M-and-E-system.git (push)

    ### If you don’t see a remote, you need to add it.
    - git remote add origin https://github.com/MuhupuaKamaii/M-and-E-system.git

5. If there might have been changes on GitHub that you don’t have locally, pull first
    - (Replace main with the correct branch name if it’s not main.)
    - git pull origin main

6. git push origin main
    - Push Your Changes

## How to push everything expect App.jsx
1. Add all files except App.jsx
    - git add . ':!Frontend/src/App.jsx'
    - ':!' tells Git to exclude that file.

2. Check what will be committed
    - git status

3. Commit
    - git commit -m "Your message"


4. Push
    - git push


# Frontend

## module that you need to install
- npm install react-router-dom

## Notes From Backend To Frontend

- Created a folder in the frontend test so we can test if the functions are working. So dont really mind it. You can take the logic to help you guys. Remember this is just plain syntax for testing.

-  

## Login Password
### Admin
    - Username:admin
    - Password:Admin123
### NPC
    - Username:npc
    - Password:npc
### OMA
    - Username:oma
    - Password:oma