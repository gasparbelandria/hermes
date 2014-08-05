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
$app->post('/getallp','getAllPais');
$app->post('/getalls','getAllSucursal');
$app->post('/getalld','getAllDepartamento');


$app->get('/session','session');   
$app->get('/logout', 'logout');
$app->get('/employees', 'getEmployees');
$app->get('/company', 'getCompany');
$app->get('/allcompany', 'getAllCompany');
$app->get('/employees/:id', 'getEmployee');
$app->get('/departamento/:id','getDepartment');
$app->get('/employees/:id/reports', 'getReports');

$app->run();

function getDepartment($id){
        $id = explode('_', $id);
        $usuarios = "SELECT usuarios.ID,usuarios.nombre, usuarios.apellido, usuarios.puesto FROM usuarios " .
           "LEFT JOIN usuario_perfil ON usuarios.ID = usuario_perfil.usuario_id WHERE usuario_perfil.pais= ".$id[0].
           "  AND usuario_perfil.sucursal= ".$id[1]." AND usuario_perfil.departamento= ".$id[2].
           " AND usuarios.compania_id= ".$_SESSION['compania'];
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
    $departamento = "SELECT departamento.nombre, departamento.departamento_id FROM departamento " .
           "WHERE departamento.compania_id=".$_SESSION['compania'];
    $sucursal = "SELECT sucursal.nombre, sucursal.sucursal_id FROM sucursal " .
       "WHERE sucursal.compania_id=".$_SESSION['compania'];
    $pais = "SELECT pais.nombre, pais.pais_id FROM pais " .
       "WHERE pais.compania_id=".$_SESSION['compania'];
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

     $sql = "select e.ID, e.nombre, e.apellido, e.cedula,r.correo_corp " .
            "from usuarios e left join usuario_perfil r on r.usuario_id = e.ID " .
            "group by e.ID order by e.apellido, e.nombre";

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
           "usuario_perfil.telefono_1 , usuario_perfil.movil_1 , usuario_perfil.correo_corp ".
           "FROM usuarios left join usuario_perfil on usuario_perfil.usuario_id = usuarios.ID ".
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
      "FROM usuarios WHERE UPPER(CONCAT(usuarios.nombre, ' ', usuarios.apellido)) LIKE :name ". 
      "group by usuarios.ID order by usuarios.apellido, usuarios.nombre";

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
    $sql = "SELECT usuarios.ID, usuarios.user, usuarios.password, usuarios.nombre,usuarios.apellido,usuarios.type,usuarios.compania_id  " .
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