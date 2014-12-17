var Neufbox = require('./neufbox');

var nb = new Neufbox();

nb.connect( {username: 'admin', password: 'zoidberg'}, function(){
    //doing stuff in this callback is uggly...
    nb.getDnsHostList(function(err, res){
        console.log(res);
    });
    nb.deleteDnsHost( {name : 'test.lan'} );
});
