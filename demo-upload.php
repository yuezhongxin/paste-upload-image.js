<?php

// 这只是一个示例
// This is a demo

function  upload_handle (){
	$result=array ("success"=>false,"message"=>"Null");
	$file_size_limit=300*1024; // 300KB
	if (in_array($_FILES["imageFile"]["type"],array ("image/gif","image/jpeg","image/pjpeg","image/png"))){
		if ($_FILES["imageFile"]["error"]>0){
			$result['message']="error";
		}
		elseif ($_FILES["imageFile"]["size"]>$file_size_limit){
			$result['message']="File too large";
		}else {
			$file_name="upload/".md5_file($_FILES["imageFile"]["tmp_name"]).str_replace("image/",".",$_FILES["imageFile"]["type"]);
			if (!file_exists($file_name)){
				move_uploaded_file($_FILES["imageFile"]["tmp_name"],$file_name);
			}
			$result['success']=true;
			$result['message']=$file_name;
		}
	}else {
		$result['message']="Invalid file";
	}
	return $result;
}

$origin = isset($_SERVER['HTTP_ORIGIN'])? $_SERVER['HTTP_ORIGIN'] : '';

$allow_origin = array(
    'http://sub1.example.com',
    'http://sub2.example.com'
);

if(in_array($origin, $allow_origin)){
    header('Access-Control-Allow-Origin:'.$origin); //跨域访问
	header("Access-Control-Allow-Credentials", "true");
}

header('Content-type: application/json');

echo(json_encode(upload_handle()));

?>