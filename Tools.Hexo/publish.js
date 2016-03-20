var m_objApp = window.external;
var m_objCommon = m_objApp.CreateWizObject('WizKMControls.WizCommonUI');
var m_db = m_objApp.Database;
var m_settings_key = 'publish2Hexo_settings';
loadSettings(m_settings_key);


function publish2Hexo() {
	//************获取当前正在显示的wizDocument*******************//
	var selected_document = m_objApp.Window.CurrentDocument;
	var title = selected_document.Title;
	var content = selected_document.GetText(0x01);
	var tmpFileName = m_objCommon.GetATempFileName('.md');
	m_objCommon.SaveTextToFile(tmpFileName, content, 'utf-8');
	var blogRoot = document.getElementById('blog-root').value;
	m_db.SetMeta(m_settings_key, 'blog-root', blogRoot);

	var distPath = blogRoot + '/source/_posts/' + title;
	m_objCommon.CopyFile(tmpFileName, distPath);//覆盖式copy

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