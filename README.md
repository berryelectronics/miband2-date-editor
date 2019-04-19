# **Mi Band 2 Date Editor**

```
 Your warranty is now probably void.

  I am not responsible for any bricked devices, do this at your own risk!
```

The Mi Band 2 is a really popular and inexpensive Wearable that has many fans around the world. However, the representation of the current date on the homescreen (Small "Fri, Apr 19") is only available in english. But with this tool you can change the software running on your Mi Band 2 and change which characters are shown for the date texts, to localize your Mi band to your language!

This procedure requires a bit of preparation, because there are some limitations to how many individual characters are available to you. But below you can find an easy and quick way to change the localization. Or you can search if somebody has already made the changes for your language and has shared his setup here in this thread, as this software has the option to export and share your settings!

**Features**
* Change the texts shown when you look at the current date/time on your Mi Band 2
* This enables you to localize your Mi Band to your language, or even to change the font style!
* Together with my other software, the [URL="https://forum.xda-developers.com/general/accessories/miband2-program-to-modify-notification-t3720641"]Mi Band 2 FW editor[/URL], you can change the complete style and representations of icons and texts on your Mi Band 2!
* You don't need to worry about choosing the right version, as the software auto-detects the firmware you loaded in
* By saving the changes made to the firmware to a "Table Data File", you can share your localization changes with others or save them for yourself. The Table Data File is Firmware/Hardware-Revision independent!

**To Do**
* Support the indian version.

## **Downloads**

### **[Releases](https://github.com/berryelectronics/miband2-date-editor/releases)**
### **[Source Code](https://github.com/berryelectronics/miband2-date-editor)**

## **Instructions**


* **Check your Mi Band Hardware Revision**
This might be a little tricky. One way is with the App ["Mi Band Masters"](https://play.google.com/store/apps/details?id=blacknote.mibandmaster). 
After you authorized your Mi Band, you can find your hardware version under the tab "Statistics". This Image is from the [Gadgetbridge Wiki](https://github.com/Freeyourgadget/Gadgetbridge/wiki/Mi-Band-2-Firmware-Update):
Now you have to look which firmware file is needed for your hardware version. If you Mi Band doesnt has a pulse sensor, its the hrx variant.
> ![Tables](http://berryelectronics.de/_projects/miband2-date-editor/image/image6.png)

* **Getting the desired firmware file for your Mi Band**
Now that you know which Mi Band Firmware file you need. When you scroll down the [Gadgetbridge Wiki for the Mi Band 2](https://github.com/Freeyourgadget/Gadgetbridge/wiki/Mi-Band-2-Firmware-Update), 
you can find the lists for which Mi Fit App version had which firmware versions. **NOTE:** This tool only supports 1.0.1.x Version files, everything older doesnt make sense to search all the icons for. 
You search the group with your Mi Band Firmware name, and look out the needed Mi Fit Version. 
Now you can search the needed version APK on sites like [APKMirror](http://apkmirror.com). Download the APK from there and open it with a ZIP-programm like Winrar. 
The needed .fw-file will be in the folder assets. Extract that file.

* **Editing your firmware**
Now you are finally ready to edit the firmware! Open the Mi Band 2 Date Editor, press "Load File...", click on "Firmware File" and select your firmware file. 
You can also load in now a Table Data File if you have one. In it you can save your changes to the firmware file, so in case you want to use your settings on a different firmware/hardware version or want to share your language settings online, you can load them from here and apply the changes instantly.

The best workflow would be to first sketch everything out in a spreadsheet or on paper. First, write down the short versions (3 characters) of the days of the week or the months down. 
> ![Example for a German translation](http://berryelectronics.de/_projects/miband2-date-editor/image/image1.png) 
> *Example for a German translation*

then write down the characters in the "character table". Look for matching characters, as these dont need to be edited. The characters not needed from the character tables can now be replaced with the missing characters in the table. However, you have to take into consideration, that the maximum width of your "pixelfont"-character cannot exceed the width of the character it is replacing in the character table (Example: you couldnt fit a 5 pixel wide character, like an "a" into the available width of the character "i" (1 pixel wide))
> ![Example for a German translation. Green is a match. Orange are characters that get replaced and the red cells are left over characters](http://berryelectronics.de/_projects/miband2-date-editor/image/image2.png)
> *Example for a German translation. Green is a match. Orange are characters that get replaced and the red cells are left over characters*

After you have changed the characters in the appropriate fields in the table (empty characters can be a space, but dont forget edit the font!), you can change the text representations in the "text tables" on the right side. You simply have to look up the "position" number of the character you want to insert to the text and select it from the dropdown.
> ![Example for a German translation](http://berryelectronics.de/_projects/miband2-date-editor/image/image3.png)
> *Example for a German translation*

After that, the only thing left is to edit the pixel representations of the characters you changed. Simply click on the pencil button next to the changed character. Now the Character Editor will open.

The Black squares are the turned on pixels, the white/transparent squares are turned off pixels. Underneath the pixel editor, you can change the width of the character
> ![The character editor. I have changed the character 'd' to the german character 'ä'](http://berryelectronics.de/_projects/miband2-date-editor/image/image4.png)
> *The character editor. I have changed the character 'd' to the german character 'ä'*

When you're all done, you can save the changes you have made by clicking on "Save File...". Here you have the option to save your changes to a Table Data File, for future modifications or for sharing, or save your 
 modified firmware to flash it onto your Mi Band 2!

* **Flashing your new edited firmware**
You are nearly done! All you have to do now, is to copy the edited firmware file onto your phone (f.ex. with a usb cable or via bluetooth), and open up the "Mi Band Master" App 
(Though you can use nearly all third party apps, most of them support flashing from a file), and after syncing with Mi Fit, you have to open up the settings. 
There you enter "Wristband" and press on "Firmware". Here you can select "Firmware Update from file" and select the edited firmware. Now your Mi Band will receive the new firmware and restart afterwards. 
Now you're done!

## **Troubleshoot**

This program is working properly and you shouldnt be at risk of bricking your device. If someone wants to improve it or use parts of the code (like all the offset data), you happily can use it with credits. This is rather a usable "demo" of the research and exploration i made with the Mi Band 2. 
I would be pleased to get feedback and error reports, and you for sure can submit changes to the program through github.

## **Credit**
Thanks to SirStefan for the documentation of the font data for the small text used for the date and as a general ressource: [Post](https://forum.xda-developers.com/general/accessories/miband2-scheme-translation-date-to-t3690142)

The software around it, the positions for all the tables and characters across all hardware and firmware versions (FW: 1.0.1.xx) were made by me.

The software's dependencies can be found in the [package.json file](https://github.com/berryelectronics/miband2-date-editor/blob/master/package.json)
For detailed credits and tools used, visit the Github Page.

## **Screenshots**

My example German language uploaded to my Mi Band 2
> ![Screenshot](http://berryelectronics.de/_projects/miband2-date-editor/image/image5.jpg)
