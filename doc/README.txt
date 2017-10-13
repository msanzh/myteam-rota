AUTHOR:	Miguel Sanz

DATE: 	30/03/2017

CONTENT TREE:

	MyTeamRota
	|
	|
	|--- doc
	|    |
	|    |--- README.txt
	|    |
	|    |--- myteam_rota.pem
	|    |
	|    |--- myteam_rota.reg
	|    |
	|    |--- updates.xml
	|
	|
	|--- myteam_rota (folder)
	|
	|
	|--- myteam_rota.crx



- Google Chrome extension package:
	myteam_rota.crx

- Google Chrome extension key to generate same extension_id to rebuild package:
	myteam_rota.pem

- Runable file to add security exceptions to Windows registry to enable automatic installation (one click):
	myteam_rota.reg

- Update manifest file, see doc: https://developer.chrome.com/extensions/autoupdate
	updates.xml

- Source code:
	myteam_rota



BUILD:
	1) See doc: https://developer.chrome.com/extensions/packaging
	2) Proceed to build a new version of myteam_rota.crx with the extension key myteam_rota.pem in doc folder.
	3) Upload new version to server.
	4) Update the file updates.xml in the server to release it.
	