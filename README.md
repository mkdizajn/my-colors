My colors
=========

'My colors' is a service that will generate the most used colors in your picture. 

See example of app:

![Alt text](https://raw.githubusercontent.com/mkdizajn/my-colors/master/ja.jpeg "My picture")

Using it
----------

Just sent parameter named 'i' and as a value direct url to your picture

    http://colors.mk-dizajn-it.hr/?i=https://nutty.io/images/nutty.png

*?i=(here paste your picture url)*

If you don't send the param, you'll see me :)

Columns meaning
-----------------------

1. color sample
2. percentage of color in picture
3. hex color value

How to use it as a API
------------------------------

Rename parameter **i** => **j** you'll get little object of strings in JSON

```javascript
	[
	  "302010",
	  "503020",
	  "b0b090",
	  "909070",
	  "808060",
	  "90a080",
	  "a0b080",
	  "806040",
	  "a02030",
	  "907050",
	  "c0a070",
	  "b09060",
	  "d0b080"
	]
```

CSS output of that colors
----------------------------------

Rename parameter **i** => **c** you'll get output like this





- - -
that's it :)

cheers, k.
