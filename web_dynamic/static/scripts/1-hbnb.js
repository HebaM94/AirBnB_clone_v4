$(document).ready(function() {
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
