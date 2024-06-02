$(document).ready(function() {
    let placesUrl = 'http://' + window.location.hostname + ':5001/api/v1/places_search/';

    function searchPlaces(amenities) {
        let requestData = amenities ? { amenities: amenities } : {};
        $.ajax({
            type: 'POST',
            url: placesUrl,
            contentType: 'application/json',
            data: JSON.stringify({}),
            success: function(data) {
                for (const place of data) {
                    // Create the article tag representing a place
                    let article = $('<article></article>');

                    // Append the place details to the article
                    article.append(`<div class="title_box"><h2>${place.name}</h2><div class="price_by_night">$${place.price_by_night}</div></div>`);
                    article.append(`<div class="information"><div class="max_guest">${place.max_guest} Guests</div><div class="number_rooms">${place.number_rooms} Bedrooms</div><div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div></div>`);
                    article.append(`<div class="description">${place.description}</div>`);
                    // Append the article to the section.places
                    $('section.places').append(article);
                };
            },
            error: function(xhr, textStatus, errorThrown) {
                console.error('Error:', errorThrown);
            }
        });
    }

    let apiUrl = 'http://' + window.location.hostname + ':5001/api/v1/status/';
    $.get(apiUrl, function(data) {
        if (data.status === 'OK') {
            $('div#api_status').addClass('available');
            searchPlaces(); // Display places if API is available
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

    $('button').click(function() {
        let amenities = Object.keys(checkedItems);
        searchPlaces(amenities);
    });
});
