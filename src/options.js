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
        if (ev.target.id === 'contextMenu'){
            if (ev.target.value==="on"){
                getDataTypes('dash', Lookup.DataTypes, Lookup.DefaultConfig, (loadedDataType, loadedDataTypes, loadedSortType)=>{
                    initContextMenu(loadedDataType, loadedDataTypes, loadedSortType);
                });
            }
            else {
                clearContextMenu();
            }
        }
    });

    // Init
    $('#layout-contents').show();
    getConfigs((conf)=>{
        //console.log('conf',conf);
        Object.keys(conf).forEach((key)=>{
            $('#'+key).val(conf[key]);
        });
    });
    const meta = chrome.runtime.getManifest();
    $('#version').text(`Version:${meta.version}`);
});