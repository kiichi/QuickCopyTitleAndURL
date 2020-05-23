$(document).ready(function(){
    $('.pure-menu-item').on('click', function(){
        $('.pure-menu-item').removeClass('selected');
        $('.contents').hide();
        const id = $(this).attr('data-contents');
        $('#'+id).show();
        $(this).addClass('selected');
    });

    $('#layout-form').on('change',function(ev){
        setConfig(ev.target.id, ev.target.value);
    });

    // Init
    $('#layout-contents').show();
    getConfig(function(conf){
        //console.log('conf',conf);
        Object.keys(conf).forEach((key)=>{
            $('#'+key).val(conf[key]);
        })
    });
});