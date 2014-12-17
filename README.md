node-neufbox
============

Node module to interface with NeufBox v4 API

**This projet is currently in progress, lot of stuff are not implemented yet.**

How to install
--------------

```
npm install node-neufbox
```

How to use
----------

To use, simple require Neufbox module
```
var neufbox = require('node-neufbox');
````

You can now access to public methods without authentification:
```
neufbox.getCurrentIP(function(ip){
  console.log(ip);
});
```

If you need authentification, use the `connect` method and provide your username and password
```
neufbox.connect( {username: 'admin', password: 'zoidberg'}, function(){
  //do stuff...
}); 
```

