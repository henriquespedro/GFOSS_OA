<?php

/**
 * @copyright (c) 2014, Pedro Henriques
 * @return string Mensagem enviada ou não
 * @param string $SMTP_HOST - Nome do servidor de smtp de envio (tb pode ser da gmail)
 * @param string $SMTP_PORT - Porta do servidor de email
 * @param string $SMTP_UNAME - Email de um utilizador com acesso ao mail, não tem que ter obrigariamente que ser admin, pode ser um email criado exclusivamente para os script's
 * @param string $SMTP_PWORD - Password do email anterior
 */
define("SMTP_HOST", "smtp.XXXXXX.pt");
define("SMTP_PORT", "587");
define("SMTP_UNAME", "XXXXXX");
define("SMTP_PWORD", "XXXXXX");

include "classes/class.phpmailer.php";

//Email para envio
$EMAIL_RECEPTOR = "XXXXXX@gmail.com";

$conn = pg_connect("host=localhost dbname=sig_web user=postgis password=XXXXXX");
// Ciclo para receber os valores enviados por url através do Ficheiro Javascript da aplicação e para definir automaticamente a variavel e o respectivo valor 
foreach ($_REQUEST as $key => $value) {
    $$key = $value;
}

$maxuid = "SELECT MAX(id) FROM fc_ocorrencias";
$querymaxuid = pg_query($conn, $maxuid);
while ($row = pg_fetch_array($querymaxuid)) {
    $resultrow = $row;
    $resultmaxuid = $resultrow['max'];
}
$valorsum = 1;
$sum = $resultmaxuid + $valorsum;
$UID = 'OA_2014_' . $sum;


$sqlinsertvalues = "INSERT INTO fc_ocorrencias(codigo_ocorrencia, nome_requerente, contacto, email_requerente, categoria_ocorrencia, descricao_ocorrencia, geom) VALUES('" . $UID . "','" . $nome_requerente . "','" . $contacto . "', '" . $email_requerente . "', '" . $categoria_ocorrencia . "', '" . $descricao_ocorrencia . "', ST_GeomFromText('" . $thegeom . "', 3857))";

$queryinsert = pg_query($conn, $sqlinsertvalues);
pg_close($conn);


// Estruturação da Mensagem em HTML
$message = '<html><body>';
$message .= '<img src="http://sugik.isegi.unl.pt/imagens/ISEGIUNL.jpg" alt="Mestrado C&SIG" /><br><br>';
$message .= 'Foi submetido com sucesso o registo de uma ocorrência ambiental com os seguintes dados:<br>';
$message .= '<table rules="all" style="border-color: #666;" cellpadding="10">';
$message .= "<tr style='background: #eee;'><td><strong>Nome:</strong> </td><td>" . $nome_requerente . "</td></tr>";
$message .= "<tr><td><strong>Contato:</strong> </td><td>" . $contacto . "</td></tr>";
$message .= "<tr><td><strong>Email:</strong> </td><td>" . $email_requerente . "</td></tr>";
$message .= "<tr><td><strong>Categoria da Ocorrência:</strong> </td><td>" . $categoria_ocorrencia . "</td></tr>";
$message .= "<tr><td><strong>Descricao:</strong> </td><td>" . $descricao_ocorrencia . "</td></tr>";
$message .= "<tr><td><strong>Código do Registo:</strong> </td><td>" . $UID . "</td></tr>";
$message .= "</table>";
$message .= "</body></html>";


// Envio do email
$mail = new PHPMailer; //Construtor
$mail->IsSMTP();

// Para usar no caso de ser um smtp especifico, como é o caso da CMO
$mail->Host = SMTP_HOST;
$mail->Port = SMTP_PORT;
$mail->SMTPAuth = true;
$mail->Username = SMTP_UNAME;
$mail->Password = SMTP_PWORD;
$mail->AddAddress($EMAIL_RECEPTOR, "XXXXXX"); //Endereço destinatário
$mail->AddReplyTo($EMAIL_RECEPTOR, "XXXXXX"); //Endereço de resposta
$mail->SetFrom($email_requerente, $nome_requerente); //Endereço de envio
$mail->AddCC($email_requerente, $nome_requerente); //Endereço para CC
//$mail->AddBCC($EMAIL, $NOME); //Endereço para BCC
$mail->Subject = "Registo de Ocorrências Ambientais"; //Subject od your mail
$mail->MsgHTML($message); //Put your body of the message you can place html code here
//$mail->AddAttachment($photo); //Se for para usar anexos
$send = $mail->Send(); //Enviar o email
if ($send) {
    echo '{"success": true, "msg": "Submetido com sucesso"}';
} else {
    echo '{"success": false, "msg": "Erro ao submeter"}';
}
?>
