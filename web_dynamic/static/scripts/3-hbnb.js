$(document).ready(function() {
    // Function to make a POST request to /api/v1/places_search/
    function searchPlaces() {
        $.ajax({
            type: 'POST',
            url: 'http://0.0.0.0:5001/api/v1/places_search/',
            contentType: 'application/json',
            data: JSON.stringify({}),
            success: function(data) {
                displayPlaces(data);
            },
            error: function(xhr, textStatus, errorThrown) {
                console.error('Error:', errorThrown);
            }
        });
    }

    // Function to dynamically display the retrieved places
    function displayPlaces(places) {
        $('.places').empty(); // Clear the existing places

        places.forEach(function(place) {
            // Create the article tag representing a place
            let article = $('<article>');

            // Append the place details to the article
            article.append($('<div>').addClass('title_box').append($('<h2>').text(place.name)));
            article.append($('<div>').addClass('price_by_night').text('$' + place.price_by_night));
            article.append($('<div>').addClass('information').append($('<div>').addClass('max_guest').text(place.max_guest + ' Guest' + (place.max_guest !== 1 ? 's' : ''))));
            article.append($('<div>').addClass('information').append($('<div>').addClass('number_rooms').text(place.number_rooms + ' Bedroom' + (place.number_rooms !== 1 ? 's' : ''))));
            article.append($('<div>').addClass('information').append($('<div>').addClass('number_bathrooms').text(place.number_bathrooms + ' Bathroom' + (place.number_bathrooms !== 1 ? 's' : ''))));
            article.append($('<div>').addClass('description').text(place.description));

            // Append the article to the section.places
            $('.places').append(article);
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

        searchPlaces(); // Refresh places based on selected amenities
    });
});
