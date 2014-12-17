var Neufbox = require('./neufbox');

var nb = new Neufbox();

nb.connect( {username: 'admin', password: 'zoidberg'}, function(err, res){
    if(!err)
        doStuff();
});

var doStuff = function(){
    nb.getDnsHostList(function(err, res){
        console.log(res);
    });
    nb.addDnsHost( {name : 'test.lan', ip: '192.168.1.45' }, function(err, res){
        console.log(res);
    });
    nb.getClients(function(res){
        console.log(res);
    });
}
