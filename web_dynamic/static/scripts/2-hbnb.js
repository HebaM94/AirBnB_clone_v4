$(document).ready(function() {
    let apiUrl = 'http://' + window.location.hostname + ':5001/api/v1/status/';
    $.get(apiUrl, function(data) {
        if (data.status === 'OK') {
            $('div#api_status').addClass('available');
        } else {
            $('div#api_status').removeClass('available');
        }
    });

    let checkedItems = {};
    $('input[type="checkbox"]').change(function() {
        let amenityId = $(this).attr('data-id');
        let amenityName = $(this).attr('data-name');

        if (this.checked) {
            checkedItems[amenityId] = amenityName;
        } else {
            delete checkedItems[amenityId];
        }

        let amenitiesList = Object.values(checkedItems).join(', ');
        $('div.amenities h4').text(amenitiesList);
    });
});
