MonoGame.Js
===========

JavaScript game libary that is based on the XNA/MonoGame API

The only "dependancies" on modern browsers the API takes is the HTML canvas 
object and the addEventListener function. Otherwise the code is valid 
ECMAScript 3 code and should work if those two are pollyfilled.

Clown.html contains both a game that is both an example of how to use 
MonoGame.Js and is used as a basic test to make sure it works correctly.

There are places where the API is different in more than just ECMAScript ways 
(so besides making methods start with lowercase letters):

* To create a Game class to put your own methods on you use the 
  Game.createGame(cstr) function which sets up an object for you that you can 
  set the prototype of to add instance functions to but inherits from the Game 
  class. The function you pass in will be called as the constructor and can use 
  this as though it is a constructor.
* The initialize, loadContent, contentLoaded, update, draw, unloadContent, and 
  exit methods are expected to be "replaced" in your game. To call the Game 
  objects base version call base_[function name], for example base_initialize 
  for Game's initialize method.
* Because textures are loaded asynchronously you just load content in 
  loadContent and then in contentLoaded do any logic based on that content.
* There is no TimeSpan object, instead just plain milliseconds are used. So 
  for example you instead of gameTime.elapsedGameTime it's
  gameTime.elapsedGameMilliseconds.
* Remember that Point, Vector2, and Matrix are all copy by ref not copy by 
  value.
* loadSong and loadSoundEffect both can take an array of urls to allow for 
  mutiple encoding formats to help with cross-browser development.
