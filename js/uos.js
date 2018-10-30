var uos={
    files: [],
    update: function(scope='#ui'){
        this.noClicks(true);
       $('hr').replaceWith( '<div class="divider">'+"=".repeat( $('#ui').width()/11 )+'</divider>' );
        for(var btxt=$('#buffer').html(),ctxt=$(scope).html(),pos=0,blen=btxt.length,clen=ctxt.length;pos<blen;pos++ ){
            if( pos < clen && btxt[pos]==ctxt[pos] ) continue;
            var scope = $(scope);
           $(scope).typed({
                strings: $('#buffer').html().split('#PAGE#'),
                showCursor: false,
                typeSpeed:0.1
            });
            break;
        }
        $('#buffer').empty();
        this.noClicks(false);
    },
    noClicks: function(mode=true){
        $('#bg').css('pointer-events',(mode?'initial':'none'));
    },
    boot: function(){      
        /* Fit background to window size */
        $(window).resize(function(e){
            e.preventDefault();
            $('body').height(window.innerHeight);
            $('#bg').height(window.innerHeight);
            $('body').width(window.innerWidth);
            /*$('#bg').width(window.innerWidth);*/
        }).resize();
        /* Replace inputs with active spans */
        $('.input').each(function(){
            $(this).prop('tagName','span');
        });
        /* Rewrite default link behaviour */
         $(document).on('click', 'a', function(e) {
             e.preventDefault();
             if(this.href.includes('#')){
               uos.loadStatic(this.href.split('#'));
             }else{
                uos.load(this.href);
             }
        });
        $(document).on('mouseover','a',function(e){
            $("#terminal input").val("go "+this.href);
        })
        $(document).on('click','#terminal input',function(){
            $(this).val(''); 
        });
        $(document).on('submit','#terminal',function(e){
            e.preventDefault();
            var cmd = $(this).find('input').val().split(/\s+/);
            if(cmd.length == 2 && cmd[0] == "go") {
                if(!cmd[1].startsWith('http')) cmd[1] = "//"+cmd[1];
                window.location.href = cmd[1];
            }
            else{
                console.log(cmd);
                $('#ajax').typed({
                    strings: ["Error: Unknown command"],
                    showCursor: false,
                    typeSpeed:1
                });
            }
        });
        $('#ajax').load('.\\pages\\index.html', function(){
            uos.update();
        });
    },
    load: function(url){
        if( url.startsWith('http:') || url.startsWith('https:') ){
            window.location.href = url;
        }else{
            $("#buffer").load(url,function(response, status, xhr){
                if( status == "error" ){
                    $('#buffer').html('ERROR: Network resource ['+url+'] is not available.');
                }
                uos.update('#ajax');
            });
        }
    },
    loadMessage: function(message){
        $('#ajax').typed({
                strings: message.split('#PAGE#'),
                showCursor: false,
                typeSpeed:1
        });
    }
};