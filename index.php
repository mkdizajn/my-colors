<?php
include_once("colors.php");
$ex=new GetMostCommonColors();
$img=isset($_GET['i']) ? $_GET['i'] : '';
$imgg=isset($_GET['j']) ? $_GET['j'] : '';
if($img==''){
	$img = 'https://www.google.hr/images/srpr/logo11w.png';//"https://avatars3.githubusercontent.com/u/767837?s=460";
}
if($imgg<>''){
	$oo = array();
	for ($i = 0; $i <= $how_many; $i++)
	{
		array_push($oo, $colors_key[$i]);
	}
	echo json_encode($oo);
	exit();
}
$colors=$ex->Get_Color($img);
$how_many=12;
$colors_key=array_keys($colors);
?>
<!DOCTYPE html>
<html lang="en"><head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="description" content="send me your picture and I'l give you your most used colors in it :)">
	<meta name="author" content="mk dizajn">
	<link rel="shortcut icon" href="favicon.ico">

	<title>Give me my colors</title>

	<!-- Bootstrap core CSS -->
	<link href="css/bootstrap.min.css" rel="stylesheet">

	<!-- Custom styles for this template -->
	<link href="css/app.css" rel="stylesheet">
	<!-- FA magic -->
	<link href="css/css/font-awesome.min.css" rel="stylesheet">
</head>
<body>
	<div class="navbar navbar-fixed-top navbar-inverse" role="navigation">
		<div class="container">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="/">My great colors :)</a>
			</div>
			<div class="collapse navbar-collapse">
				<ul class="nav navbar-nav">
					<li class="active"><a href="#">Start</a></li>
					<li><a href="#contact">Contact</a></li>
				</ul>
			</div><!-- /.nav-collapse -->
		</div><!-- /.container -->
	</div><!-- /.navbar -->

	<div class="container">

				<p class="text-center h3 text-primary">This is picture</p>
				<p>
					<img src=<?php echo $img ?> alt="" class="img-rounded img-responsive center-block">
				</p>

		<div class="table-responsive">
			<table class="table">
				<thead>
					<tr><th colspan="3"><?php echo $img ?></th></tr>
					<tr><td>Color</td><td>Count</td><td>Color value</td></tr>
				</thead>
				<tbody>
					<?php
					for ($i = 0; $i <= $how_many; $i++)
					{
					    echo "<tr><td bgcolor=".$colors_key[$i]."></td><td>".$colors[$colors_key[$i]]."</td><td>$colors_key[$i]</td></tr>";
					}
					?>
				</tbody>
			</table>
		</div>

		<hr>
		<footer>
			<p>&copy; mk 2014</p>
		</footer>

	</div>
    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="js/jquery.min.js"></script>
    <script src="js/bootstrap.min.js"></script>

</body>
</html>
