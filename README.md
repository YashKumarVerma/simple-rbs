# Role Based Systems

[![Ensure Build](https://github.com/YashKumarVerma/simple-rbs/actions/workflows/build.yml/badge.svg)](https://github.com/YashKumarVerma/simple-rbs/actions/workflows/build.yml)[![Tests](https://github.com/YashKumarVerma/simple-rbs/actions/workflows/tests.yml/badge.svg)](https://github.com/YashKumarVerma/simple-rbs/actions/workflows/tests.yml)

Playlist explaining the codebase : [Here](https://www.youtube.com/playlist?list=PLupsfJMkYeYs7sqgUCXI7ePxAdf7_6Trs)

This is a simple demo of an application that utilized role based authentication mechanism to ensure correct access of data and services. In addition to RBS, we're also implementing a cahce layer to demonstrate how database operations can get a significant performance boost with the right thickness of abstraction.

## Notes
- To automatically test the roles and functioning of the RBS mechanism, we've setup e2e tests. These check and ensure that each role behaves the way they are expected to. Watch all the tests passing.
  
[![asciicast](https://asciinema.org/a/400439.svg)](https://asciinema.org/a/400439)

and see the coverage report here : [simple-rbs-coverage.surge.sh](http://simple-rbs-coverage.surge.sh/)

Note that since cache is disabled during tests, the cache service has poor coverage. If you are interesting in manually testing the roles, follow the readme from here. Using this [postman collection](https://documenter.getpostman.com/view/10043948/Tz5v3an4) can ease up the testing process. 

I'm currently working on testing the cache-enabled-performance, and it's taking a hit beucase there's a lot of serialization and de-serialization going over a single thread. This gives rise to an overhead that reduces the benefits of adding the cache layer.

However for large responses, cache gives **significant performance improvements**.

## Running
- `yarn install`

- `yarn start:dev`

## Setting up the project.
The project uses mongodb as a data storage layer and relies on redis for the cache layer. I strongly recommend running the a redis container to ease the entire process. 

To launch a basic container with open ports, run - `docker run -d --name some-redis -p 6379:6379 redis`. Do the same with monngodb instance, and make sure to change the configs in `config/default.yml` to ensure that the connection strings are still valid.

## Seeding Data
@todo
>Since the application has database and cache implement, it is vital that to demo it, there is sufficient data on the system. Refer to whatever method you are using for mongodb, and import the `db.dump.json` file. I'll recommend the Azure extension on VSCode which allows linking local databases too. Everything stays in VSCode.


## Loggin In
To make it as close to practical life, the roles of the users are stored in the database itself, and even users who have not logged in are given a role. Don't worry, that doesn't need to be done manually, the role resolver automatically gives the visitor role to anyone who does not have one.

The password for all users is 12345, and everything is stored as plaintext in the database.

![https://i.imgur.com/2Zf7K7F.png](https://i.imgur.com/2Zf7K7F.png)

Once you log in, a **cookie is saved on the browser**, which can be used to identify the user and role. To change the role, simply logout and login with a different credential.

## Testing the Roles

### Visitors
```js
controller
    .grant(ROLE.VISITOR)
    .readAny('vehicle')
    .createOwn('profile')
```

- Notice that the visitors do not have the permission to read the user profile, so trying to load the user profiles must throw an error.

![https://i.imgur.com/gFlDQGs.png](https://i.imgur.com/gFlDQGs.png)

- Visitors are allowed to create new profile / signup into system
- Once visitors create a profile, they can log into the system using the `auth/login` route handler.
![https://i.imgur.com/6KUGqH4.png](https://i.imgur.com/6KUGqH4.png)


### Users
When you log into system, the logs state the currently operating user alongwith their role. Also, it can be seen that this data was loaded from cache. I will share a detailed writeup about how the cache is implemented in this system (**that was a separate task**, but I've included both of them as it was an interesting problem to solve)

```csv
info: cookie.data.user1@gmail.com.user
info: cache.hit.userservice.findonebyemailandpassword::user1@gmail.com12345
```

The roles of the users are set as follows, which means that a logged in user
```js
/** roles of user in system */
controller
  .grant(ROLE.USER) 
  .extend(ROLE.VISITOR) /** everything that visitor has **/
  .readOwn('profile')   
  .deleteOwn('profile')
```
- can read their own profile
- can delete their own profile

which means that they can not list all the users in the system. let's see what happens when we try to list all users.
![https://i.imgur.com/Dyd8j0K.png](https://i.imgur.com/Dyd8j0K.png)

an interesting thing to note here is that users can **only see their own profiles**, let's test that.
![https://i.imgur.com/mCkfLnW.png](https://i.imgur.com/mCkfLnW.png)

an edge case is that what if the user tries to view someone else's profile by their email? Let's try that too. So in this example, when trying to view the details of **`admin@gmail.com`**, the system throws an exception. 
![https://i.imgur.com/21SVd7L.png](https://i.imgur.com/21SVd7L.png)


An interesting thing to note is that when I was developing this prototype, it was a mess trying to send these error codes. Too much redundant code, and try-catch-hell. So I wrote [**this npm package**](https://www.npmjs.com/package/http-exception-transformer) to sort things out. It allows me to throw an error from anywhere (i do this in the controller) and it automatically catches it and sends the response to the user.


Let us try to delete someone else's profile, and check if the system allows us. 
![https://i.imgur.com/2Q5rFU0.png](https://i.imgur.com/2Q5rFU0.png)
So we know that we cannot delete some other account by our account. Lets check if we can delete our own account.
![https://i.imgur.com/IldNNGt.png](https://i.imgur.com/IldNNGt.png)

Alright, we could delete our own profile just like we wanted.

### Moderators
The roles of moderators is to be able to view all user profiles and ensure that no profile is injecting spam into the system. 
```js
controller
  .grant(ROLE.MOD)
  .extend(ROLE.USER)
  .readAny('profile')
```

Now since the moderatos has rights to read any profile, let's check if they can get list of all users.
![https://i.imgur.com/fhwXM4A.png](https://i.imgur.com/fhwXM4A.png)

Looks like the moderator is successfully able to list all user details. Just a check to see if the roles of user are already included in the moderator role, let's see if the moderator can view details of their own profile.

![https://i.imgur.com/i3A4rWZ.png](https://i.imgur.com/i3A4rWZ.png)

Works. As a final check, let's see if the moderator can delete other profiles or not. As per the rules, they should not be able to.
![https://i.imgur.com/m4tKHOC.png](https://i.imgur.com/m4tKHOC.png)

So we're assured that the moderator is not over-powered to delete any user. Our users are safe. Almost.

### Admin
The roles of the admin are defined as 
```js
controller
  .grant(ROLE.ADMIN)
  .extend(ROLE.MOD)
  .deleteAny('profile')
```

This means that they should be able to perform all operations. Let's check how the API behaves.

![https://i.imgur.com/PF8IFMc.png](https://i.imgur.com/PF8IFMc.png)
The admin can see list of all users.  Let's check the delete feature.

![https://i.imgur.com/cHSJ3OF.png](https://i.imgur.com/cHSJ3OF.png)
The admin was able to successfully delete the user account as allowed in the role definitions.

This demonstrates the working of a simple role bases system.


## Logs

this is a section of logs generated while writing the above docs. Notice how some operations are being cached by the cache layers and database operations are being bypassed.
```txt
info: connection.mongodb.successful
info: connection.redis.success
info: cookie.data.user1@gmail.com.user
info: operating as role: user
info: operating as role: user
info: cookie.data.user1@gmail.com.user
info: operating as role: user
info: operating as role: user
info: cookie.data.user1@gmail.com.user
info: operating as role: user
info: cookie.data.user1@gmail.com.user
info: operating as role: user
info: operating as role: user
info: cookie.data.user1@gmail.com.user
info: operating as role: user
info: operating as role: user
info: cache.hit.userservice.findonebyemail::user1@gmail.com
info: cookie.data.user1@gmail.com.user
info: operating as role: user
info: operating as role: user
info: All roles: visitor,user,moderator,admin
info: All resources: vehicle,profile,$extend,backup
info: Listening in port http://localhost:3000
info: connection.mongodb.successful
info: connection.redis.success
info: cookie.data.user1@gmail.com.user
info: operating as role: user
info: cache.miss.userservice.findonebyemail::moderator@gmail.com
info: db.active
info: Attempting to set cache for userservice.findonebyemail::moderator@gmail.com
info: cache.set.userservice.findonebyemail::moderator@gmail.com
info: user.created.moderator@gmail.com
info: cookie.data.user1@gmail.com.user
info: cookie.set.false
info: cache.miss.userservice.findonebyemailandpassword::moderator@gmail.com12345
info: db.active
info: Attempting to set cache for userservice.findonebyemailandpassword::moderator@gmail.com12345
info: cache.set.userservice.findonebyemailandpassword::moderator@gmail.com12345
info: cookie.data.moderator@gmail.com.moderator
info: operating as role: moderator
info: cookie.data.moderator@gmail.com.moderator
info: operating as role: moderator
info: cache.hit.userservice.findonebyemail::moderator@gmail.com
info: cookie.data.moderator@gmail.com.moderator
info: operating as role: moderator
info: cache.hit.userservice.findonebyemail::moderator@gmail.com
info: cookie.data.moderator@gmail.com.moderator
info: operating as role: moderator
info: cookie.data.moderator@gmail.com.moderator
info: operating as role: moderator
info: cache.hit.userservice.findonebyemail::moderator@gmail.com
info: cookie.data.moderator@gmail.com.moderator
info: operating as role: moderator
info: cache.hit.userservice.findonebyemail::user3@gmail.com
info: cookie.data.moderator@gmail.com.moderator
info: operating as role: moderator
info: cache.hit.userservice.findonebyemail::user2@gmail.com
info: cookie.data.moderator@gmail.com.moderator
info: operating as role: moderator
info: cookie.data.moderator@gmail.com.moderator
info: operating as role: moderator
info: cache.miss.userservice.findonebyemail::moderator@gmail.com
info: db.active
info: Attempting to set cache for userservice.findonebyemail::moderator@gmail.com
info: cache.set.userservice.findonebyemail::moderator@gmail.com
```
