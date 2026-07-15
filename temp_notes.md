Das Monochrome-Icon (assets/android-icon-monochrome.png) zeigt die simplyPet-Pfote mit Kreuz als weiße Silhouette auf transparentem Hintergrund – genau das was als Notification-SmallIcon benötigt wird.

Lösung: Dieses PNG in verschiedenen DPI-Größen als drawable-Ressource bereitstellen (24x24, 36x36, 48x48, 72x72, 96x96 für mdpi bis xxxhdpi). Android Notification SmallIcons müssen weiß+alpha sein.
