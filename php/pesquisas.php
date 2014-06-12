<?php

foreach ($_REQUEST as $key => $value) {
    $$key = $value;
}


$conn = pg_connect("host=localhost dbname=sig_web user=postgis password=XXXXXX");
    $sql = "SELECT st_xmin(st_envelope(geom)),st_ymin(st_envelope(geom)),st_xmax(st_envelope(geom)),st_ymax(st_envelope(geom)) FROM fc_ocorrencias where codigo_ocorrencia = '" . $desc . "'";
    $query = pg_query($conn, $sql);
    $geometria = array();

    while ($row = pg_fetch_array($query)) {
        $geometria [] = "$row[0],$row[1],$row[2],$row[3]";
    }
    print json_encode($geometria);

pg_close($conn);
?>
