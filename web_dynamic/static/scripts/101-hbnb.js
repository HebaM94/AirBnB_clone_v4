$(document).ready(function() {
    let placesUrl = 'http://' + window.location.hostname + ':5001/api/v1/places_search/';
    let reviewsUrl = 'http://' + window.location.hostname + ':5001/api/v1/reviews/';


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

                    let amenitiesDiv = $('<div class="amenities"><h2>Amenities</h2><ul></ul></div>');
                    for (let amenity of place.amenities) {
                        amenitiesDiv.find('ul').append(`<li>${amenity}</li>`);
                    }
                    article.append(amenitiesDiv);

                    let reviewsDiv = $(`<div class="reviews"><h2>Reviews <span class="toggle-reviews" data-id="${place.id}">show</span></h2><ul style="display:none;"></ul></div>`);
                    article.append(reviewsDiv);

                    // Append the article to the section.places
                    $('section.places').append(article);
                };

                $('.toggle-reviews').off('click').on('click', function() {
                    let reviewList = $(this).closest('.reviews').find('ul');
                    if ($(this).text() === 'show') {
                        // Fetch and display reviews
                        let placeId = $(this).data('id');
                        $.get(`${reviewsUrl}${placeId}`, function(reviews) {
                            reviewList.empty();
                            for (const review of reviews) {
                                reviewList.append(`<li><h3>From ${review.user} the ${review.date}</h3><p>${review.text}</p></li>`);
                            }
                            reviewList.show();
                            $(this).text('hide');
                        }.bind(this));
                    } else {
                        // Hide reviews
                        reviewList.hide();
                        $(this).text('show');
                    }
                });
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

    let checkedAmenities = {};
    let checkedStates = {};
    let checkedCities = {};

    $('input[type="checkbox"]').change(function() {
        let itemType = $(this).parent().parent().parent().hasClass('locations') ? 'location' : 'amenity';
        let itemId = $(this).attr('data-id');
        let itemName = $(this).attr('data-name');

        if (itemType === 'location') {
            if ($(this).parent().parent().hasClass('states')) {
                if (this.checked) {
                    checkedStates[itemId] = itemName;
                } else {
                    delete checkedStates[itemId];
                }
            } else {
                if (this.checked) {
                    checkedCities[itemId] = itemName;
                } else {
                    delete checkedCities[itemId];
                }
            }
        } else {
            if (this.checked) {
                checkedAmenities[itemId] = itemName;
            } else {
                delete checkedAmenities[itemId];
            }
        }

        let amenitiesList = Object.values(checkedItems).join(', ');
        $('div.amenities h4').text(amenitiesList);

        let statesList = Object.values(checkedStates).join(', ');
        let citiesList = Object.values(checkedCities).join(', ');
        $('div.locations h4').text(statesList + (statesList && citiesList ? ', ' : '') + citiesList);
    });

    $('button').click(function() {
        let amenities = Object.keys(checkedAmenities);
        let states = Object.keys(checkedStates);
        let cities = Object.keys(checkedCities);

        searchPlaces({ amenities: amenities, states: states, cities: cities });

    });
});
