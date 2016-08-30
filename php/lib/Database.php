<?php
if (!defined('__SCRIPT_ROOT')) define('__SCRIPT_ROOT', dirname(__FILE__));
use  Doctrine\Common\ClassLoader;
// requires
require 'Doctrine/Common/ClassLoader.php';


    $classLoader = new ClassLoader('Doctrine', current(explode('fall2014-group1', __SCRIPT_ROOT)) . DIRECTORY_SEPARATOR . 'fall2014-group1' . DIRECTORY_SEPARATOR . 'php' . DIRECTORY_SEPARATOR . 'lib');



use Doctrine\DBAL\DriverManager;


$classLoader->register();

class Database {

    private $dbname;
    private $user;
    private $password;
    private $service;
    private $host;
    private $port;
    private $driver;
    private $connectionParams;
    /** @var \Doctrine\DBAL\Connection $databaseConnection */
    private $databaseConnection;
    /** @var \Doctrine\DBAL\Configuration $configuration */
    private $configuration;

    /**
     * @fn constructor
     * @note see http://docs.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/configuration.html
     *       For helpful information
     * @param $dbname String The name of the database
     * @param $user String Username
     * @param $password String Password
     * @param $host String Host server
     * @param $port String Host server port
     * @param $driver String What type of database (pdo_sqlite, pdo_mysql, pdo_pgsql, pdo_oci/oci8,
     *                pdo_sqlsrv.
     * @param bool $service
     */
    function __construct($dbname, $user, $password, $host, $port, $driver, $service = true) {
        $this->dbname   = $dbname;
        $this->user     = $user;
        $this->password = $password;
        $this->host     = $host;
        $this->port     = $port;
        $this->driver   = $driver;
        $this->service  = $service;
        $this->connectionParams = array(
            'dbname'   => $dbname,
            'user'     => $user,
            'password' => $password,
            'host'     => $host,
            'port'     => $port,
            'driver'   => $driver,
            'service'  => $service
        );
        $this->configuration = new Doctrine\DBAL\Configuration();
        $this->databaseConnection = DriverManager::getConnection($this->connectionParams,
            $this->configuration);
    }

    /**
     * @fn executeQuery
     *
     * @brief Executes a query on the corresponding database and returns the dataset
     *
     * @param $sql  String The query to be executed.
     * @param $result Array The result of the query, if successful
     * @internal param \Doctrine\DBAL\Connection $databaseConnection The connection to the database.
     * @return bool Whether the query executed successfully or not
     */
    function executeQuery ($sql, &$result) {
        /** @var $statement Doctrine\DBAL\Statement */
        $statement = $this->databaseConnection->prepare($sql);
        $statementExecutedSuccessfully = $statement->execute();
        if ($statementExecutedSuccessfully) {
            $data = $statement->fetchAll();
            $result = $data;
            return true;
        } else {
            // Log the data
            return false;
        }
    }

    /**
     * @return \Doctrine\DBAL\Connection
     */
    public function getDatabaseConnection()
    {
        return $this->databaseConnection;
    }
}