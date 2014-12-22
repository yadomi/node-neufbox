var request = require('request');
var parseString = require('xml2js').parseString;
var crypto = require('crypto');

var Neufbox = function(){
    this.url = 'http://192.168.1.1';
    this.endpoints = {
        stb     : '/stb/info'
    };
    this.version = '/api/1.0';
}

Neufbox.prototype.connect = function(auth, cb){
    var _this = this;

    this._getToken(function(token){
        _this.token = token;
        hashToken(token, auth);
    });

    var hashToken = function(token, auth){
        var hash_username = crypto.createHash('sha256').update(auth.username).digest("hex"),
            hash_password = crypto.createHash('sha256').update(auth.password).digest("hex");

        var hash_secret_username = crypto.createHmac('sha256', token).update(hash_username).digest('hex'),
            hash_secret_password = crypto.createHmac('sha256', token).update(hash_password).digest('hex');

        _this.hash = hash_secret_username + hash_secret_password;
        _this.checkToken(function(err){
            if (err) var e = new Error(err.msg);
            typeof cb === 'function' && cb(e);
        });
    }
}

Neufbox.prototype._getToken = function(cb){
    var _this = this;
    request.get( {
        url : this.url + this.version,
        qs  : {method: 'auth.getToken'}
        }, function(err,res,xml){
            if(err)
                return err;
            _this._toObject(xml, function(data){
                extractToken(data);
            });
        }
    );

    var extractToken = function(data){
        cb(data.rsp.auth[0].$.token);
    }
}

Neufbox.prototype.makeRequest = function(method, params, cb){
    var _this = this;
    var endpoint = method.split('.')[0];
    var qs = {
        method : method,
        token  : this.token,
        hash    : this.hash
    };
    if (!params) params = {};
    for (var attrname in qs) { params[attrname] = qs[attrname]; }
    request.get( {
        url : this.url + this.version ,
        qs  : params
        },
        function(err, res, xml){
            _this._toObject(xml, function(data){
                if(data.rsp.$.stat === 'fail')
                    typeof cb === 'function' && cb(data.rsp.err[0].$, null);
                else {
                    typeof cb === 'function' && cb(null, data.rsp[endpoint][0].$);
                }
            });
    } )
}

Neufbox.prototype.checkToken = function(cb){
    var _this = this;
    request.get( {
        url : this.url + this.version,
        qs  : {
            method : 'auth.checkToken',
            token  : this.token,
            hash   : this.hash
        } }, function(err,res,xml){
            if(err)
                return err;
            _this._toObject(xml, function(data){
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
        _this._toObject(data, parseResponse);
    });

    var parseResponse = function(data){
        cb(data.info);
    }
}

Neufbox.prototype.getDnsHostList = function(cb){
    var _this = this;
    request.get( {
        url : this.url + this.version,
        qs  : {
            method : 'lan.getDnsHostList',
            token  : this.token,
        } }, function(err,res,xml){
            _this._toObject(xml, parseResponse);
    });

    var parseResponse = function(data){
        if(data.rsp.$.stat === 'fail'){
            cb(data.rsp.err[0].$, null);
            return false;
        }
        var dnsList = [];
        if(data.rsp.dns){
            data.rsp.dns.forEach(function(item){
                dnsList.push(item.$);
            });
        }
        cb(null, dnsList);
    }
}

//TODO
Neufbox.prototype.deleteDnsHost = function(params, cb){
    var _this = this;
    var qs = {
        method : 'lan.deleteDnsHost',
        token  : this.token
    };
    for (var attrname in qs) { params[attrname] = qs[attrname]; }
    request.post( {
        url : this.url + this.version,
        qs  : params
        }, function(err,res,xml){
            _this._toObject(xml, function(data){
                if(data.rsp.$.stat === 'fail'){
                    typeof cb === 'function' && cb(data.rsp.err[0].$, null);
                }
                else {
                    typeof cb === 'function' && cb(null, {stat: 'ok'});
                }
            });
    });
}

//TODO
Neufbox.prototype.addDnsHost = function(params, cb){
    var _this = this;
    var qs = {
        method : 'lan.addDnsHost',
        token  : this.token
    };
    for (var attrname in qs) { params[attrname] = qs[attrname]; }
    request.post( {
        url : this.url + this.version,
        qs  : params
        }, function(err,res,xml){
            _this._toObject(xml, function(data){
                if(data.rsp.$.stat === 'fail'){
                    typeof cb === 'function' && cb(data.rsp.err[0].$, null);
                }
                else {
                    typeof cb === 'function' && cb(null, {stat: 'ok'});
                }
            });
    });
}

Neufbox.prototype.getCurrentIP = function(cb){
    this.getInfo(function(res){
        cb(res.ppp[0].ipaddr[0]);
    });
}

Neufbox.prototype.getClients = function(cb){
    this.getInfo(function(res){
        cb(res.lan[0].client);
    });
}

Neufbox.prototype._toObject = function(xml, cb){
    parseString(xml, function(err, result) {
        if (err)
            return err;
        cb(result);
    });
}

module.exports = Neufbox;
