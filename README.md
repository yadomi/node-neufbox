node-neufbox
============

** /!\ Due to the recent update of the Neufbox Framework (NB6V-MAIN-R3.4.5) by SFR, the route /stb/info is no longer available. This mean that every requests made to this route will fail, which is about 85% of this module. Fortunately, the private API isn't impacted and every authenticated requests will work.**

Node module to interact with NeufBox v4 API

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
```

You can now access to public methods without authentification:
```
neufbox.getInfo(function(info){
  console.log(info.iad);
});
```

If you need authentification, use the `connect` method and provide your username and password
```
neufbox.connect( {username: 'admin', password: 'admin'}, function(){
  //do stuff...
}); 
```

Then you can use methods that require authentification:
```
neufbox.getDnsHostList(function(err, res){
    console.log(res);
});
```

Changelog
---------

###0.0.5

- Add generic method `_makeRequest`
