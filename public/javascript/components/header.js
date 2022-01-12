$(document).ready(()=>{
// what is window.header?
  window.header = {};
// how to make user id match cookie (user.id 1 (buyer), user.id 2 (seller))
  const $pageHeader = $('#page-header');
  let currentUser = null;
  function updateHeader(user) {
    currentUser = user;
    $pageHeader.find("#page-header__user-links").remove();
    let userLinks;
// if buyer user id
    if (!user) {
      userLinks = `
      <nav id="page-header__user-links" class="page-header__user-links">
        <ul>
          <li class="home">🏠</li>
          <li class="search_button">Search</li>
          <li class="login_button">Log In</li>
          <li class="sign-up_button">Sign Up</li>
        </ul>
      </nav>
      `
// if seller user id
    } else {
      userLinks = `
      <nav id="page-header__user-links" class="page-header__user-links">
        <ul>
          <li class="home">🏠</li>
          <li class="search_button">Search</li>
          <li>${user.name}</li>
          <li class="create_listing_button">Create Listing</li>
          <li class="my_listing_button">My Listings</li>
          <li class="my_reservations_button">My Reservations</li>
          <li class="logout_button">Log Out</li>
        </ul>
      </nav>
      `
    }

    $pageHeader.append(userLinks);
  }

  window.header.update = updateHeader;

  getMyDetails()
    .then(function( json ) {
    updateHeader(json.user);
  });

  $("header").on("click", '.my_reservations_button', function() {
    itemListings.clearListings();
    getAllItems()
      .then(function(json) {
        itemListings.addItems(json.reservations, true);
        views_manager.show('listings');
      })
      .catch(error => console.error(error));
  });
  $("header").on("click", '.my_listing_button', function() {
    itemListings.clearListings();
    getAllListings(`owner_id=${currentUser.id}`)
      .then(function(json) {
        itemListings.addItems(json.properties);
        views_manager.show('listings');
    });
  });

  $("header").on("click", '.home', function() {
    itemListings.clearListings();
    getAllListings()
      .then(function(json) {
        itemListings.addItems(json.properties);
        views_manager.show('listings');
    });
  });

  $('header').on('click', '.search_button', function() {
    views_manager.show('searchProperty');
  });

  $("header").on('click', '.logout_button', () => {
    logOut().then(() => {
      header.update(null);
    });
  });

  $('header').on('click', '.create_listing_button', function() {
    views_manager.show('newProperty');
  });

});
