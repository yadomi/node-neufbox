var request = require('request');
var parseString = require('xml2js').parseString;
var crypto = require('crypto');

function Neufbox(){
    this.url = 'http://192.168.1.1';
    this.endpoints = {
        stb : '/stb/info'
    };
}

Neufbox.prototype.connect = function(auth, cb){
    var _this = this;

    this.getToken(function(token){
        _this.token = token;
        hashToken(token, auth);
    });

    var hashToken = function(token, auth){
        var hash_username = crypto.createHash('sha256').update(auth.username).digest("hex"),
            hash_password = crypto.createHash('sha256').update(auth.password).digest("hex");

        var hash_secret_username = crypto.createHmac('sha256', token).update(hash_username).digest('hex'),
            hash_secret_password = crypto.createHmac('sha256', token).update(hash_password).digest('hex');

        _this.hash = hash_secret_username + hash_secret_password;
        _this.checkToken(function(res, err){
            typeof cb === 'function' && cb(res, err);
        });
    }
}

Neufbox.prototype.getToken = function(cb){
    var _this = this;
    request.get( {
        url : this.url + '/api/1.0/',
        qs  : {method: 'auth.getToken'}
        }, function(err,res,xml){
            if(err)
                return err;
            _this.toObject(xml, function(data){
                extractToken(data);
            });
        }
    );

    var extractToken = function(data){
        cb(data.rsp.auth[0].$.token);
    }
}

Neufbox.prototype.checkToken = function(cb){
    var _this = this;
    request.get( {
        url : this.url + '/api/1.0',
        qs  : {
            method : 'auth.checkToken',
            token  : this.token,
            hash   : this.hash
        } }, function(err,res,xml){
            if(err)
                return err;
            _this.toObject(xml, function(data){
                parseResponse(data);
            });
    });

    var parseResponse = function(data){
        if(data.rsp.$.stat === 'fail'){
            cb(data.rsp.err[0].$, null);
            return false;
        }
        cb(null, data.rsp.auth[0].$);
    }
}

Neufbox.prototype.getInfo = function(cb){
    var _this = this;
    request.get(this.url + this.endpoints.stb, function(err, res, data){
        if(err)
            return err
        _this.toObject(data, cb);
    });
}

//TODO
Neufbox.prototype.getDnsHostList = function(cb){
    request.get( {
        url : this.url + '/api/1.0',
        qs  : {
            method : 'lan.getDnsHostList',
            token  : this.token,
        } }, function(err,res,xml){
            console.log(xml);
    });
}

//TODO
Neufbox.prototype.deleteDnsHost = function(params, cb){
    var qs = {
        method : 'lan.deleteDnsHost',
        token  : this.token
    };
    for (var attrname in qs) { params[attrname] = qs[attrname]; }
    console.log(params);
    request.post( {
        url : this.url + '/api/1.0',
        qs  : params
        }, function(err,res,xml){
            console.log(xml);
    });
}

//TODO
Neufbox.prototype.addDnsHost = function(params, cb){
    var qs = {
        method : 'lan.addDnsHost',
        token  : this.token
    };
    for (var attrname in qs) { params[attrname] = qs[attrname]; }
    console.log(params);
    request.post( {
        url : this.url + '/api/1.0',
        qs  : params
        }, function(err,res,xml){
            console.log(xml);
    });
}

Neufbox.prototype.getCurrentIP = function(cb){
    this.getInfo(function(res){
        cb(res.info.ppp[0].ipaddr[0]);
    });
}

Neufbox.prototype.getClients = function(cb){
    this.getInfo(function(res){
        cb(res.info.lan[0].client);
    })
}

Neufbox.prototype.toObject = function(xml, cb){
    parseString(xml, function(err, result) {
        if (err)
            return err;
        cb(result);
    });
}

module.exports = Neufbox;
