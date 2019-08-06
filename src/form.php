<?php
    $to = 'okal.ihor@gmail.com';
    $subject = "Form " .$_SERVER['HTTP_REFERER'];
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text; charset=utf-8" . "\r\n";
	
	foreach ($_POST as $key => $value) {
		$message = $message . $key . ": " . $value . "\n";
	}
 
    mail($to, $subject, $message, $headers);
?>