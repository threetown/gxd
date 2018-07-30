$('#tab li').on('click',function () {
    let value = $(this).attr('value');
    HomeMap.tabChange(value)
})
var main_ol = {
    setRqInfo: function (data) {
        $('#city_cnt').text(data.city_cnt);
        $('#city_cnt_gather').text(data.city_cnt_gather);
        $('#area_cnt').text(data.area_cnt);
        $('#streetoffice_cnt').text(data.streetoffice_cnt);
    },
    setRqCount:function (data) {
        $('#community_cnt').text(data.community_cnt);
        $('#building_cnt').text(data.building_cnt);
        $('#unit_cnt').text(data.unit_cnt);
        $('#house_cnt').text(data.house_cnt);
    },
    setCityList:function (data) {
        let html = '';
        let tbody  = $('#tBody_city');
        data.forEach((item) => {
            html +=
                '<tr>' +
                '<td>' + item.city_name + '</td>' +
                '<td>' + item.community_cnt + '</td>' +
                '<td>' + item.building_cnt + '</td>' +
                '<td>' + item.unit_cnt + '</td>' +
                '<td>' + item.house_cnt + '</td>' +
                '</tr>'
        })
        tbody.html(html)
    }
}