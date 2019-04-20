$( document ).ready(function() {
    let index =0;
    if(navigator.onLine){
        for(let i=index;i<index+9;i++){
            $.get( "/recommendation/"+(document.getElementById("name").value).toString()+'/'+i, function( data ) {
                $(".grid").append(data);
            });
        }
        index+=9;
    }
    else{
        $.get( "/offlineinfo", function( data ) {
            $(".offline").empty().append(data);
        });
    }


    $(".recom").click(()=>{
        if(navigator.onLine){
            $(".grid").empty();
            $(".offline").empty();
            for(let i=index;i<index+9;i++){
                $.get( "/recommendation/"+(document.getElementById("name").value).toString()+'/'+i, function( data ) {
                    $(".grid").append(data);
                });
            }
            index+=9;
        }
        else{
            $.get( "/offlineinfo", function( data ) {
                $(".offline").empty().append(data);
            });
        }

    });

});