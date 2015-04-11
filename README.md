# BYU-Classifieds

BYU classifieds page for CS360 project.

---

User Schema:

* username
* firstName
* lastName
* address : {
    street,
    state,
    zip,
    city  }
* phoneNumber : {
      type,
      number:
  }
* email

---

Ad Item Schema:

* userID   = ID of the user that posted the item
* title    = Title of the ad
* postDate = Date of when the item was posted
* category = Chosen category of the item
* bought   = Boolean of whether it was bought or sold
* comments = List of comment objects of userID and comment

---

Comment Schema:

* userID = ID of the user that posted the item
* text   = Text of the Comment

---

Item Categories:

* Apartment Contracts
* Music Gear
* Jewelry
* Books
* Textbooks
* Carpool Rides
* Furniture
* Computers
* Video Games
* Movies
* House Appliances
* Cars and Auto Parts
* Cell Phones
* Sport Gear
* Other Electronics
* Free
