var Neufbox = require('./neufbox');

var nb = new Neufbox();

nb.connect( {username: 'admin', password: 'zoidberg'}, function(){
    //doing stuff in this callback is uggly...
    nb.getDnsHostList(function(err, res){
        console.log(res);
    });
    // nb.deleteDnsHost( {ip : '192.168.1.78', name : 'bender.cakelaboratories.com'} );
    // nb.addDnsHost( {ip : '192.168.1.21', name : 'test.lan'} );
    // nb.getDnsHostList();
});
