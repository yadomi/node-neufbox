var assert = require("assert")
var Neufbox = require('../neufbox');

describe('Neufbox', function(){

    describe('#connect()', function(){
        it('should connect without error', function(done){
            var nb = new Neufbox();
            nb.connect( {username: 'admin', password: 'zoidberg'}, function(err, res){
                if (err) throw err;
                done();
            });
        })
    });

    describe('#getCurrentIP()', function(){
        it('should return 84.101.104.32', function(done){
            var nb = new Neufbox();
            nb.getCurrentIP(function(ip){
                assert.equal(ip, "84.101.104.32");
                done();
            });
        })
    });

})
