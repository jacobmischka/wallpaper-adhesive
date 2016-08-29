# Wallpaper Adhesive

Sticks images together to create wallpapers with different images on each display.

At least on GNOME, there's no built-in way to do this, you just need to fire up GIMP and put some images together at the correct resolutions and span them across your desktop. This removes the image creation step, though you still need to set it as your wallpaper and then set it to Spanned mode instead of Zoom.

**Depends on imagemagick being installed on your computer.**

## Caveats / TODOs

- Very ugly still, have done nearly no styling whatsoever
- Images that are not the correct aspect ratio for the selected monitor are cropped on the right and bottom until they are. I would like this to at least crop from the center, though that'll probably be the extent of this small app's scope.
- Uses electron for what is essentially a glorified shell script, pretty unnecessary but other GUI toolkits are a pain and I don't really feel like learning one of them.

## Screenshots

![App window](/images/app.png)

![Desktop with wallpaper](/images/desktop.png)
