var m_objApp = window.external;
var m_objCommon = m_objApp.CreateWizObject('WizKMControls.WizCommonUI');
var m_db = m_objApp.Database;
var m_settings_key = 'publish2Hexo_settings';
loadSettings(m_settings_key);


function publish2Hexo() {
	//************获取当前正在显示的wizDocument*******************//
	var selected_document = m_objApp.Window.CurrentDocument;
	var tagsTxt = selected_document.TagsText;
	var title = selected_document.Title;
	var content = selected_document.GetText(0x01);
	var date = selected_document.DateCreated;
	
	//*************复制文档至Hexo所对应的目录****************//
	var tmpFileName = m_objCommon.GetATempFileName('.md');
	var hexDoc = genHexoDoc(title, date, tagsTxt, content);

	m_objCommon.SaveTextToFile(tmpFileName, hexDoc, 'utf-8');
	var blogRoot = document.getElementById('blog-root').value;
	m_db.SetMeta(m_settings_key, 'blog-root', blogRoot);

	var distPath = blogRoot + '/source/_posts/' + title;
	m_objCommon.CopyFile(tmpFileName, distPath);//覆盖式copy

	//***********执行Hexo命令***************************//
	var path = m_objApp.CurPluginAppPath;
	var exefilename = path + 'Wiz2Hexo.exe';
	var exitCode = m_objCommon.RunExe(exefilename, blogRoot, true);
	if(exitCode != 0){
		alert("Please check your blog root path!");
	}
}

function loadSettings(settings_meta) {
	var blogPath = m_db.GetMeta(settings_meta, "blog-root");
	document.getElementById('blog-root').value = blogPath;
}

function genHexoDoc (title, date, tagsTxt, content) {
	var title_ = title.split('.', 1);
	var date_ = toHexoDateStr(date);
	var tags_ = tagsTxt.replace(/;/g,',');


	var template = ''
	+ '---' + '\n'
	+ 'title: ' + title_ + '\n'
	+ 'date: ' + date_ + '\n'
	+ 'tag: [' + tags_  + ']' + '\n'
	+ '---' + '\n'
	+ content;

	return template;
}

function toHexoDateStr(date) {
	// convert to date what like 2016-03-13 13:21:28
    var dt = new Date(Date.parse(date));
    var bRet = '' 
    + dt.getFullYear() + '-'
    + (parseInt(dt.getMonth()) + 1) + '-'
    + dt.getDate() + ' '
    + dt.getHours() + ':'
    + dt.getMinutes() + ':'
    + dt.getSeconds();
   
   	return bRet;
}