<?php
session_cache_limiter(false);
session_start(); 
require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->post('/login', 'login');
$app->post('/createc','createCompany');
$app->post('/createp','createPais');
$app->post('/creates','createSucursal');
$app->post('/created','createDepartamento');
$app->post('/createpuesto','createPuesto');
$app->post('/createuser','createUser');
$app->post('/createpapi','createPAPI');
$app->post('/createhbdi','createHBDI');
$app->post('/finishpapi','finishPAPI');
$app->post('/finishhbdi','finishHBDI');
$app->post('/finishpuesto','finishPuesto');

$app->post('/getallp','getAllPais');
$app->post('/getalls','getAllSucursal');
$app->post('/getalld','getAllDepartamento');
$app->post('/getallpuestos','getAllPuestos');
$app->post('/gethbdi','getHbdi');
$app->post('/getpapi','getPapi');
$app->post('/cImage','cropImage');
$app->post('/sImage','saveImage');

$app->get('/session','session');   
$app->get('/logout', 'logout');
$app->get('/employees', 'getEmployees');
$app->get('/company', 'getCompany');
$app->get('/allcompany', 'getAllCompany');
$app->get('/employees/:id', 'getEmployee');
$app->get('/departamento/:id','getDepartment');
$app->get('/resultadohbdi/:id','getResultadoHBDI');
$app->get('/resultadopapi/:id','getResultadoPAPI');
$app->get('/employees/:id/reports', 'getReports');

$app->run();

function cropImage(){

    $imgUrl = $_POST['imgUrl'];
    $imgInitW = $_POST['imgInitW'];
    $imgInitH = $_POST['imgInitH'];
    $imgW = $_POST['imgW'];
    $imgH = $_POST['imgH'];
    $imgY1 = $_POST['imgY1'];
    $imgX1 = $_POST['imgX1'];
    $cropW = $_POST['cropW'];
    $cropH = $_POST['cropH'];

    $jpeg_quality = 100;
    $hashrand=rand();
    $output_filename = "../pics/croppedImg_".$hashrand;
    $output_filename1 = "http://localhost:8888/hermes/pics/croppedImg_".$hashrand;
    $what = getimagesize($imgUrl);
    switch(strtolower($what['mime']))
    {
        case 'image/png':
            $img_r = imagecreatefrompng($imgUrl);
            $source_image = imagecreatefrompng($imgUrl);
            $type = '.png';
            break;
        case 'image/jpeg':
            $img_r = imagecreatefromjpeg($imgUrl);
            $source_image = imagecreatefromjpeg($imgUrl);
            $type = '.jpeg';
            break;
        case 'image/gif':
            $img_r = imagecreatefromgif($imgUrl);
            $source_image = imagecreatefromgif($imgUrl);
            $type = '.gif';
            break;
        default: die('image type not supported');
    }
        
        $resizedImage = imagecreatetruecolor($imgW, $imgH);
        imagesavealpha( $resizedImage, true );
        $trans_colour = imagecolorallocatealpha($resizedImage, 0, 0, 0, 127);
        imagefill($resizedImage, 0, 0, $trans_colour);
        imagecopyresampled($resizedImage, $source_image, 0, 0, 0, 0, $imgW, 
                    $imgH, $imgInitW, $imgInitH);   
        
        
        $dest_image = imagecreatetruecolor($cropW, $cropH);
        imagesavealpha(  $dest_image, true );
        $trans_colour = imagecolorallocatealpha($dest_image, 0, 0, 0, 127);
        imagefill($dest_image, 0, 0, $trans_colour);
        imagecopyresampled($dest_image, $resizedImage, 0, 0, $imgX1, $imgY1, $cropW, 
                    $cropH, $cropW, $cropH);    


       
         switch(strtolower($what['mime']))
    {
        case 'image/png':
            imagepng($dest_image, $output_filename.$type);
            break;

        default: imagejpeg($dest_image, $output_filename.$type, $jpeg_quality);
    }
        $response = array(
                "status" => 'success',
                "url" => $output_filename1.$type 
              );
         print json_encode($response);
}

function saveImage(){
    $hashrand=rand();
    $imagePath = "../pics/";
    $imagePath1 = "http://localhost:8888/hermes/pics/";
    $allowedExts = array("gif", "jpeg", "jpg", "png", "GIF", "JPEG", "JPG", "PNG");
    $temp = explode(".", $_FILES["img"]["name"]);
    $extension = end($temp);

    if ( in_array($extension, $allowedExts))
      {
      if ($_FILES["img"]["error"] > 0)
        {
             $response = array(
                "status" => 'error',
                "message" => 'ERROR Return Code: '. $_FILES["img"]["error"],
            );
            echo "Return Code: " . $_FILES["img"]["error"] . "<br>";
        }
      else
        {
            
          $filename = $_FILES["img"]["tmp_name"];
          $newfilename = $hashrand.".".$extension;
          list($width, $height) = getimagesize( $filename );

          move_uploaded_file($filename,  $imagePath . $newfilename);

          $response = array(
            "status" => 'success',
            "url" => $imagePath1.$newfilename,
            "width" => $width,
            "height" => $height
          );
          
        }
      }
    else
      {
       $response = array(
            "status" => 'error',
            "message" => 'something went wrong',
        );
      }
      
      print json_encode($response);
}

function getDepartment($id){
        $usuarios = "SELECT usuarios.ID,usuarios.nombre, usuarios.apellido, usuarios.puesto,puestos.nombre as puestonombre FROM usuarios " .
           "LEFT JOIN puestos ON usuarios.puesto = puestos.ID WHERE puestos.departamento_id= ".$id.
           " AND puestos.compania_id= ".$_SESSION['compania'];
        // Include support for JSONP requests
        try {
        $db = getConnection();
        $stmt = $db->query($usuarios);
        $usuarios = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($usuarios);
        } else {
            echo $_GET['callback'] . '(' . json_encode($usuarios) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}
function getResultadoPAPI($id){
        $usuarios = "SELECT resultados_papi.*, usuarios.nombre,usuarios.apellido,puestos.nombre as puestonombre FROM resultados_papi" .
           " LEFT JOIN usuarios ON resultados_papi.usuario_id = usuarios.ID".
           " LEFT JOIN puestos ON usuarios.puesto = puestos.ID ".
           " WHERE resultados_papi.usuario_id= ".$id;
        // Include support for JSONP requests
        try {
        $db = getConnection();
        $stmt = $db->query($usuarios);
        $usuarios = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($usuarios);
        } else {
            echo $_GET['callback'] . '(' . json_encode($usuarios) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getResultadoHBDI($id){
        $usuarios = "SELECT resultados_hbdi.*, usuarios.nombre,usuarios.apellido,puestos.nombre as puestonombre FROM resultados_hbdi" .
           " LEFT JOIN usuarios ON resultados_hbdi.usuario_id = usuarios.ID".
           " LEFT JOIN puestos ON usuarios.puesto = puestos.ID ".
           " WHERE resultados_hbdi.usuario_id= ".$id;
        // Include support for JSONP requests
        try {
        $db = getConnection();
        $stmt = $db->query($usuarios);
        $usuarios = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($usuarios);
        } else {
            echo $_GET['callback'] . '(' . json_encode($usuarios) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getCompany(){
    $departamento = "SELECT departamento.nombre, departamento.ID,departamento.sucursal_id FROM departamento " .
           "WHERE departamento.compania_id= ".$_SESSION['compania']." AND deleted = 0";
    $sucursal = "SELECT sucursal.nombre, sucursal.ID,sucursal.pais_id FROM sucursal " .
       "WHERE sucursal.compania_id= ".$_SESSION['compania']." AND deleted = 0";
    $pais = "SELECT pais.pais_id, pais.ID,lookup_paises.nombre FROM pais LEFT JOIN lookup_paises ON lookup_paises.ID = pais.pais_id " .
       "WHERE pais.compania_id= ".$_SESSION['compania']." AND deleted = 0";
    try {
        $db = getConnection();
        $stmt = $db->query($departamento);
        $company['departamento'] = $stmt->fetchAll(PDO::FETCH_OBJ);
        $stmt = $db->query($sucursal);
        $company['sucursal'] = $stmt->fetchAll(PDO::FETCH_OBJ);
        $stmt = $db->query($pais);
        $company['pais'] = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($company);
        } else {
            echo $_GET['callback'] . '(' . json_encode($company) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

/**
 * Authorise function, used as Slim Route Middlewear
 */
function authorize($role = "user") {
    return function () use ( $role ) {
        // Get the Slim framework object
        $app = Slim::getInstance();
        // First, check to see if the user is logged in at all
        if(!empty($_SESSION['user'])) {
            // Next, validate the role to make sure they can access the route
            // We will assume admin role can access everything
            if($_SESSION['user']['role'] == $role || 
                $_SESSION['user']['role'] == 'admin') {
                //User is logged in and has the correct permissions... Nice!
                return true;
            }
            else {
                // If a user is logged in, but doesn't have permissions, return 403
                $app->halt(403, 'You shall not pass!');
            }
        }
        else {
            // If a user is not logged in at all, return a 401
            $app->halt(401, 'You shall not pass!');
        }
    };
}

function getEmployees() {

    if (isset($_GET['name'])) {
        return getEmployeesByName($_GET['name']);
    } else if (isset($_GET['modifiedSince'])) {
        return getModifiedEmployees($_GET['modifiedSince']);
    }

    /*$sql = "select e.id, e.firstName, e.lastName, e.title, count(r.id) reportCount " .
            "from employee e left join employee r on r.managerId = e.id " .
            "group by e.id order by e.lastName, e.firstName";*/

     $sql = "select usuarios.ID, usuarios.nombre, usuarios.apellido, usuarios.cedula,usuarios.correo_corp " .
            "from usuarios left join usuario_perfil on usuario_perfil.usuario_id = usuarios.ID " .
            "where usuarios.compania_id = ". $_SESSION['compania'] .
            "group by usuarios.ID order by usuarios.apellido, usuarios.nombre";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $employees = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employees);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employees) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
    echo "go";
}

function getEmployee($id) {
    $sql = "SELECT usuarios.ID, usuarios.nombre, usuarios.apellido, usuarios.cedula, usuarios.puesto, " .
           "usuario_perfil.telefono_1 , usuario_perfil.movil_1 , usuario_perfil.correo_corp,puestos.nombre as puestonombre ".
           "FROM usuarios left join usuario_perfil on usuario_perfil.usuario_id = usuarios.ID ".
           "left join puestos on puestos.ID =usuarios.puesto " .
           "WHERE usuarios.ID=$id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $employee = $stmt->fetchObject();
        $db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employee);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employee) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getEmployeesByName($name) {

     $sql = "SELECT usuarios.ID, usuarios.nombre, usuarios.apellido, usuarios.cedula,usuarios.puesto " .
      "FROM usuarios left join usuario_perfil on usuario_perfil.usuario_id = usuarios.ID ". 
      "WHERE UPPER(CONCAT(usuarios.nombre, ' ', usuarios.apellido)) LIKE :name AND ". 
      "usuarios.compania_id = ". $_SESSION['compania'] .
      " group by usuarios.ID order by usuarios.apellido, usuarios.nombre";

    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $name = "%".$name."%";
        $stmt->bindParam("name", $name);
        $stmt->execute();
        $employees = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employees);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employees) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function getReports($id) {

    $sql = "select e.id, e.firstName, e.lastName, e.title, count(r.id) reportCount " .
            "from employee e left join employee r on r.managerId = e.id " .
            "where e.managerId=:id " .
            "group by e.id order by e.lastName, e.firstName";

    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $employees = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employees);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employees) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getModifiedEmployees($modifiedSince) {
    if ($modifiedSince == 'null') {
        $modifiedSince = "1000-01-01";
    }
    $sql = "select * from employee WHERE lastModified > :modifiedSince";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("modifiedSince", $modifiedSince);
        $stmt->execute();
        $employees = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employees);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employees) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

//----------------------------------------------//
//             Autenticacion                    //
//----------------------------------------------//


function session(){
    if( isset($_SESSION['ID'])){
       echo json_encode($_SESSION);   
    }else{
       echo json_encode(false);   
    }
}

function logout(){
    session_destroy();
    echo json_encode(true); 
}

function login() {
    if(!empty($_POST['email']) && !empty($_POST['password'])) {
        $data = credentials($_POST['email'],$_POST['password']);
        if ($data!=false){
            if($_POST['email'] == $data->user && $_POST['password'] == $data->password) {
                session_regenerate_id();
                $_SESSION['user'] = $data->user;
                $_SESSION['nombre'] = $data->nombre;
                $_SESSION['apellido'] = $data->apellido;
                $_SESSION['type'] = $data->type;
                $_SESSION['ID'] = $data->ID;
                $_SESSION['compania'] = $data->compania_id;
                $_SESSION['hbdi'] = $data->hbdi;
                $_SESSION['papi'] = $data->papi;
                session_write_close();
                echo json_encode( $_SESSION);
            }
        }
        else {
            echo '{"error":{"text":"Usuario o Contraseña Incorrectos"}}';
        }
    }
    else {
        echo '{"error":{"text":"Se requiere Nombre de Usuario y Contraseña"}}';
    }
}

function credentials($user,$password){
    $sql = "SELECT usuarios.ID, usuarios.user, usuarios.password, usuarios.nombre,usuarios.apellido,usuarios.type,usuarios.compania_id,usuarios.hbdi,usuarios.papi  " .
      "FROM usuarios WHERE usuarios.user = '". $user . "' AND usuarios.password = '". $password."'";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $user = $stmt->fetchObject();
        $db = null;
        return $user;
    } catch(PDOException $e) {
       return "false";
    }
}
//----------------------------------------------//
//            Get Company/Users                 //
//----------------------------------------------//

function getAllCompany(){
    $sql = "SELECT  * FROM companias WHERE deleted=0";
     try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $sql = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($sql);
        } else {
            echo $_GET['callback'] . '(' . json_encode($sql) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

}

function getAllDepartamento(){
     $sql = "SELECT  * FROM departamento WHERE compania_id= ".$_POST['companiaid']." AND deleted=0";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $sql = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($sql);
        } else {
            echo $_GET['callback'] . '(' . json_encode($sql) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getAllSucursal(){
    $sql = "SELECT  * FROM sucursal WHERE compania_id= ".$_POST['companiaid']." AND deleted=0";
     try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $sql = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($sql);
        } else {
            echo $_GET['callback'] . '(' . json_encode($sql) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getAllPuestos(){
    $sql = "SELECT  * FROM puestos WHERE compania_id= ".$_POST['companiaid']." AND deleted=0";
     try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $sql = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($sql);
        } else {
            echo $_GET['callback'] . '(' . json_encode($sql) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getHbdi(){
    $sql = "SELECT  * FROM test_hbdi WHERE usuario_id= ".$_POST['usuarioid']."";
     try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $sql = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($sql);
        } else {
            echo $_GET['callback'] . '(' . json_encode($sql) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getPapi(){
    $sql = "SELECT  * FROM test_papi WHERE usuario_id= ".$_POST['usuarioid']."";
     try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $sql = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($sql);
        } else {
            echo $_GET['callback'] . '(' . json_encode($sql) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}
function getAllPais(){
     $sub = "SELECT DISTINCT lookup_paises.ID,lookup_paises.nombre,pais.compania_id".
     " FROM lookup_paises LEFT JOIN pais ON lookup_paises.ID = pais.pais_id AND "
     ."pais.compania_id = ".$_POST['compania']." WHERE pais.pais_id is NULL";
      $add = "SELECT pais.ID,pais.compania_id,pais.pais_id, lookup_paises.nombre FROM pais ".
     "LEFT JOIN lookup_paises ON pais.pais_id = lookup_paises.ID WHERE pais.compania_id= ".
      $_POST['compania'];
     try {
        $db = getConnection();
        $stmt = $db->query($sub);
        $country['sub'] = $stmt->fetchAll(PDO::FETCH_OBJ);
        $stmt = $db->query($add);
        $country['add'] = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($country);
        } else {
            echo $_GET['callback'] . '(' . json_encode($country) . ');';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

}

//----------------------------------------------//
//          Create Company/Users                //
//----------------------------------------------//
function createPuesto(){
    $return_a = array();
    $sql = "INSERT INTO puestos(nombre, descripcion,departamento_id,compania_id) VALUES('".$_POST['nombre']."','".$_POST['descripcion']."','".$_POST['departamentoid']."','".$_POST['companiaid']."')";
    $db = getConnection();
    $stmt = $db->prepare($sql);
    if ($stmt->execute(array($_POST['nombre'], $_POST['descripcion'],$_POST['departamentoid'],$_POST['companiaid']))) {
        $return_a = array('id' => $db->lastInsertId());
    } else {
        $return_a = array('add' => 'failed');
    }
    echo json_encode($return_a);
}
function finishPuesto(){
    $db = getConnection();
    $nameq='';
    $valueq='';
    $questionarray=array();
    foreach ($_POST['puestohbdi'] as $key => $value) {
        $nameq.=$key.',';
        $valueq.=$value .',';
        $tempname=$key;
        $questionarray[$tempname]= $value;
    }
    $questionarray['id_puesto']= $_POST['puestoid'];
    $sql = "INSERT INTO puestos_papi(".$nameq."id_puesto) VALUES("
            .$valueq."".$_POST['puestoid'].")";
    $q = $db->prepare($sql);
    $q->execute($questionarray);
}
function finishPAPI(){
    $db = getConnection();
    $nameq='';
    $valueq='';
    $questionarray=array();
    foreach ($_POST['resultadop'] as $key => $value) {
        $nameq.=$value["key"].',';
        $valueq.=$value["puntos"] .',';
        $tempname=$value["key"];
        $questionarray[$tempname]= $value["puntos"];
    }
    $questionarray['usuario_id']= $_POST['usuarioid'];
    $questionarray['compania_id']= $_POST['companiaid'];
    $sql = "INSERT INTO resultados_papi(".$nameq."usuario_id,compania_id) VALUES("
            .$valueq."".$_POST['usuarioid'].",".$_POST['companiaid'].")";
    $q = $db->prepare($sql);
    $q->execute($questionarray);
}
function finishHBDI(){
    $db = getConnection();
    $nameq='';
    $valueq='';
    $questionarray=array();
    foreach ($_POST['resultadoh'] as $key => $value) {
        $nameq.=$value["key"].',';
        $valueq.=$value["puntos"] .',';
        $tempname=$value["key"];
        $questionarray[$tempname]= $value["puntos"];
    }
    $questionarray['usuario_id']= $_POST['usuarioid'];
    $questionarray['compania_id']= $_POST['companiaid'];
    $sql = "INSERT INTO resultados_hbdi(".$nameq."usuario_id,compania_id) VALUES("
            .$valueq."".$_POST['usuarioid'].",".$_POST['companiaid'].")";
    $q = $db->prepare($sql);
    $q->execute($questionarray);
}
function createPAPI(){
    $db = getConnection();
    $user= "UPDATE usuarios SET papi = 1 WHERE ID= ".$_POST['usuarioid'].";";
    $u = $db->prepare($user);
    $u->execute();
    $sql = "SELECT usuario_id FROM test_papi WHERE usuario_id= ".$_POST['usuarioid']."";
        $stmt = $db->query($sql);
        $db = null;
        $db = getConnection();
        $questionarray=array();
    if ($stmt->rowCount() > 0) {
       $sql="UPDATE test_papi SET";
       foreach ($_POST['questions'] as $key => $value) {
            $position=$key + 1;
            $sql .= ' '.'q'. $position.' = :'.'q'. $position.','; 
            $questionarray[':'.'q'. $position] = $value;
        }
        $sql = substr($sql, 0, -1);
        $sql.=" WHERE usuario_id=".$_POST['usuarioid'].';';
        $q = $db->prepare($sql);
        $q->execute($questionarray);
    } else {
        $nameq='';
        $valueq='';
        foreach ($_POST['questions'] as $key => $value) {
            $position=$key + 1;
            $nameq.='q'. $position .',';
            $valueq.=$value .',';
            $tempname='q'. $position;
            $questionarray[$tempname]= $value;
        }
        $questionarray['usuario_id']= $_POST['usuarioid'];
        $questionarray['compania_id']= $_POST['companiaid'];
        $sql = "INSERT INTO test_papi(".$nameq."usuario_id,compania_id) VALUES("
                .$valueq."".$_POST['usuarioid'].",".$_POST['companiaid'].")";
        $q = $db->prepare($sql);
        $q->execute($questionarray);
    }
}

function createHBDI(){
    $db = getConnection();
    $user= "UPDATE usuarios SET hbdi = 1 WHERE ID= ".$_POST['usuarioid'].";";
    $u = $db->prepare($user);
    $u->execute();
    $sql = "SELECT usuario_id FROM test_hbdi WHERE usuario_id= ".$_POST['usuarioid']."";
        $stmt = $db->query($sql);
        $db = null;
        $db = getConnection();
        $questionarray=array();
    if ($stmt->rowCount() > 0) {
       $sql="UPDATE test_hbdi SET";
       foreach ($_POST['questions'] as $key => $value) {
            $position=$key + 1;
            $sql .= ' '.'q'. $position.' = :'.'q'. $position.','; 
            $questionarray[':'.'q'. $position] = $value;
        }
        $sql = substr($sql, 0, -1);
        $sql.=" WHERE usuario_id=".$_POST['usuarioid'].';';
        $q = $db->prepare($sql);
        $q->execute($questionarray);
    }else {
        $nameq='';
        $valueq='';
        foreach ($_POST['questions'] as $key => $value) {
            $position=$key + 1;
            $nameq.='q'. $position .',';
            $valueq.=$value .',';
            $tempname='q'. $position;
            $questionarray[$tempname]= $value;
        }
        $questionarray['usuario_id']= $_POST['usuarioid'];
        $questionarray['compania_id']= $_POST['companiaid'];
        $sql = "INSERT INTO test_hbdi(".$nameq."usuario_id,compania_id) VALUES("
                .$valueq."".$_POST['usuarioid'].",".$_POST['companiaid'].")";
        $q = $db->prepare($sql);
        $q->execute($questionarray);
    }
}

function createUser(){
    $return_a = array();
    $sql = "INSERT INTO usuarios(compania_id,nombre, apellido,cedula,fecha_nacimiento,puesto,user,password,type) VALUES('".$_POST['companiaid']."','".$_POST['nombre']."','".$_POST['apellido']."','".$_POST['cedula']."','".$_POST['fechanacimiento']."','".$_POST['puesto']."','".$_POST['usuario']."','".$_POST['password']."','".$_POST['type']."')";
    $db = getConnection();
    $stmt = $db->prepare($sql);
    if ($stmt->execute(array($_POST['companiaid'], $_POST['nombre'],$_POST['apellido'],$_POST['cedula'],$_POST['fechanacimiento'], $_POST['puesto'],$_POST['usuario'],$_POST['password'],$_POST['type']))) {
        $idlast = $db->lastInsertId();
        $sql1 = "INSERT INTO usuario_perfil(hijos,estado_civil, altura,peso,estatus,fecha_entrada,domicilio_1,domicilio_2,telefono_1,telefono_2,movil_1,movil_2,correo_corp,correo_perso,departamento,usuario_id) VALUES('".$_POST['hijos']."','".$_POST['estadocivil']."','".$_POST['altura']."','".$_POST['peso']."','".$_POST['estadoactual']."','".$_POST['fechaentrada']."','".$_POST['domicilio1']."','".$_POST['domicilio2']."','".$_POST['telefono1']."','".$_POST['telefono2']."','".$_POST['mobil1']."','".$_POST['mobil2']."','".$_POST['correocop']."','".$_POST['correoperso']."','".$_POST['departamento']."','".$idlast."')";
        $db1 = getConnection();
        $stmt1 = $db1->prepare($sql1);
        if ($stmt1->execute(array( $_POST['hijos'],$_POST['estadocivil'],$_POST['altura'],$_POST['peso'],$_POST['estadoactual'],$_POST['fechaentrada'],$_POST['domicilio1'],$_POST['domicilio2'],$_POST['telefono1'],$_POST['telefono2'],$_POST['mobil1'],$_POST['mobil2'],$_POST['correocop'],$_POST['correoperso'],$_POST['departamento'],$idlast))) {
            $return_a = array('id' => $idlast);
        } else {
            $return_a = array('add' => 'failed2');
        }
    } else {
        $return_a = array('add' => 'failed');
    }
    echo json_encode($return_a);
}

function createCompany(){
    $return_a = array();
    $sql = "INSERT INTO companias(nombre, logo,rubro) VALUES('".$_POST['nombre']."','".$_POST['logo']."','".$_POST['rubro']."')";
    $db = getConnection();
    $stmt = $db->prepare($sql);
    if ($stmt->execute(array($_POST['nombre'], $_POST['logo'],$_POST['rubro']))) {
        $return_a = array('id' => $db->lastInsertId());
    } else {
        $return_a = array('add' => 'failed');
    }
    echo json_encode($return_a);
}

function createPais(){
    $return_a = array();
    $sql = "INSERT INTO pais(compania_id,pais_id) VALUES('".$_POST['companiaid']."','".$_POST['paisid']."')";
    $db = getConnection();
    $stmt = $db->prepare($sql);
    if ($stmt->execute(array($_POST['companiaid'], $_POST['paisid']))) {
        $return_a = array('id' => $db->lastInsertId());
    } else {
        $return_a = array('add' => 'failed');
    }
    echo json_encode($return_a);
}

function createSucursal(){
    $return_a = array();
    $sql = "INSERT INTO sucursal(compania_id,pais_id,nombre) VALUES('".$_POST['companiaid']."','".$_POST['paisid']."','".$_POST['nombre']."')";
    $db = getConnection();
    $stmt = $db->prepare($sql);
    if ($stmt->execute(array($_POST['companiaid'], $_POST['paisid'],$_POST['nombre']))) {
        $return_a = array('id' => $db->lastInsertId());
    } else {
        $return_a = array('add' => 'failed');
    }
    echo json_encode($return_a);
}

function createDepartamento(){
    $return_a = array();
    $sql = "INSERT INTO departamento(compania_id, sucursal_id,nombre) VALUES('".$_POST['companiaid']."','".$_POST['sucursal_id']."','".$_POST['nombre']."')";
    $db = getConnection();
    $stmt = $db->prepare($sql);
    if ($stmt->execute(array($_POST['companiaid'], $_POST['sucursal_id'],$_POST['nombre']))) {
        $return_a = array('id' => $db->lastInsertId());
    } else {
        $return_a = array('add' => 'failed');
    }
    echo json_encode($return_a);
}
//----------------------------------------------//
//              DB CONECTION                    //
//----------------------------------------------//

function getConnection() {
    $dbhost="localhost";
    $dbuser="doktordan10";
    $dbpass="wolverinex";
    $dbname="hermes";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);  
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}