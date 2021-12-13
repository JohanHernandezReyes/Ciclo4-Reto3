
function validarvacio(campo, msj_vacio) {
    if (campo == "") {
        alert(msj_vacio);
        throw 'exit';
    }
}

function Verificarlogin(id, type) {

    try {
        var sesion_userid = id;
        var sesion_role = type;
        sessionStorage.setItem("id", sesion_userid);
        sessionStorage.setItem("role", sesion_role);

        if (sessionStorage.getItem("id")) {
            sesionStorage.id = sessionStorage.getItem("id");
            sesionStorage.role = sessionStorage.getItem("role");
        };

        sesion.addEventListener("change", function () {
            sessionStorage.setItem("id", sesion_userid);
            sessionStorage.setItem("role", sesion_role);
        });
    }

    catch { };

    if (sessionStorage.id == "null" || sessionStorage.id == " ") {
        $(".aut").hide();
        console.log("Usuario no autenticado");
    } else {
        if (sessionStorage.role === "ADM") {
            $(".ADM").show();
            $(".COORD").show();
            $(".ASE").show();
            try { document.getElementById("status").removeAttribute("disabled"); } catch { };
        } else if (sessionStorage.role === "COORD") {
            $(".ADM").hide();
            $(".COORD").show();
            $(".ASE").hide();
            $("#regprod").html("<a href='Productos.html' target='blank_'>Consultar Productos</a>");
            try { document.getElementById("status").removeAttribute("disabled"); } catch { };
        } else {
            $(".ADM").hide();
            $(".COORD").hide();
            $(".ASE").show();
            try { document.getElementById("status").setAttribute("disabled", "disabled"); } catch { };
        };
        console.log(sessionStorage.id);
        console.log(sessionStorage.role);
    }
}


function cerrarsesion() {
    $("#welcome").html("");
    document.getElementById("ingreso").setAttribute("hidden", "true");
    Verificarlogin("");
    document.getElementById("formlogin").removeAttribute("hidden");
    document.getElementById("btnlog").removeAttribute("hidden");
}

//Usuarios
function validarconfirm(password, confirm) {
    if (password != confirm) {
        alert("La confirmación no coincide con la contraseña ingresada");
        throw 'exit';
    }

    if ($("#password").val().length < 8) {
        alert("La contraseña de tener minimo 8 caracteres");
        throw 'exit';
    }
}

function ValidarDuplicado(email, callbackFunction) {
    $.ajax({
        url: "http://129.151.117.220:8003/api/user/all",
        type: "GET",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            callbackFunction(email, respuesta);
        }
    });
}

function ListaUsuarios(email, respuesta) {

    listusers = [];
    for (i = 0; i < respuesta.length; i++) {
        listusers.push(respuesta[i].email);
    }
    console.log(listusers);
    u = email;
    console.log(u);
    if (listusers.includes(u) && u != null) {
        alert("El email ya se encuentra registrado");
        throw exit;
    } else {
        NuevoUsuario();
    }
}


function NuevoUsuario() {
    validarvacio($("#name").val(), "Debe ingresar un nombre");
    validarvacio($("#email").val(), "Debe ingresar un e-mail");
    validarvacio($("#password").val(), "Debe ingresar una contraseña");
    validarvacio($("#confirm").val(), "Por favor confirme su contraseña");
    validarconfirm($("#password").val(), $("#confirm").val());
    document.getElementById("iduser").removeAttribute("hidden");
    var MesCumpleaños = new Date($("#birthday").val()).getMonth();
    let myData = {
        id: $("#iduser").val(),
        identification: $("#identif").val(),
        name: $("#name").val(),
        address: $("#address").val(),
        cellPhone: $("#cel").val(),
        email: $("#email").val().toLowerCase(),
        password: $("#password").val(),
        zone: $("#zona").val(),
        type: $("#tipo").val(),
        birthtDay: $("#birthday").val(),
        monthBirthtDay: MesCumpleaños + 1,
    };
    let dataToSend = JSON.stringify(myData);
    console.log(dataToSend);
    $.ajax({
        url: "http://129.151.117.220:8003/api/user/new",
        type: "POST",
        data: dataToSend,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            $("#name").val("");
            $("#email").val("");
            $("#password").val("");
            $("#confirm").val("");
            $("#address").val("");
            $("#cel").val("");
            $("#zona").val("");
            $("#identif").val("");
            $("#birthday").val("");
            alert("se ha guardado el Usuario");
            document.getElementById("iduser").setAttribute("hidden", "true");
        }
    });

}

function guardarUsuario() {
    ValidarDuplicado($("#email").val().toLowerCase(), ListaUsuarios);
    ConsultarUsuarios();
}


function ValidarUsuario(email) {
    let myData = email;
    validarvacio($("#uemail").val(), "Debe ingresar un e-mail");
    $.ajax({
        url: "http://129.151.117.220:8003/api/user/emailexist/" + myData,
        type: "GET",
        data: myData,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            if (respuesta == false) {
                alert("Usuario no existe en la base de datos");
            }
        }
    });
}



function Autenticacion(email, password) {
    ValidarUsuario(email);
    let myData = (email + "/" + password); console.log(myData);
    validarvacio($("#uemail").val(), "Debe ingresar un e-mail");
    validarvacio($("#upassword").val(), "Debe ingresar una contraseña valida");
    $.ajax({
        url: "http://129.151.117.220:8003/api/user/" + email + "/" + password,
        type: "GET",
        data: email + "/" + password,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            $("#uemail").val("");
            $("#upassword").val("");
            if (respuesta.name == null) {
                alert("Usuario o clave incorrectos");
            } else {
                document.getElementById("formlogin").setAttribute("hidden", "true");
                document.getElementById("btnlog").setAttribute("hidden", "true");
                document.getElementById("ingreso").removeAttribute("hidden");
                switch (respuesta.type) {
                    case "ADM": $("#welcome").html("Bienvenido " + respuesta.name + "<br>Ha ingresado con un rol de Administrador"); break;
                    case "COORD": $("#welcome").html("Bienvenido " + respuesta.name + "<br>Ha ingresado con un rol de Coordinador"); break;
                    case "ASE": $("#welcome").html("Bienvenido " + respuesta.name + "<br>Ha ingresado con un rol de Asesor Comercial"); break;
                }
                Verificarlogin(respuesta.id, respuesta.type);
            }

        }
    });
}


function nuevoid() {
    $.ajax({
        url: "http://129.151.117.220:8003/api/user/all",
        type: "GET",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            listusers = [];
            for (i = 0; i < respuesta.length; i++) {
                listusers.push(respuesta[i].id);
            }
            if (respuesta.length = 0) {
                $("#iduser").val(1);
            } else {
                $("#iduser").val(Math.max.apply(null, listusers) + 1);
            }
        }
    });
}

function ConsultarUsuarios() {
    $.ajax({
        url: "http://129.151.117.220:8003/api/user/all",
        type: "GET",
        datatype: "JSON",
        success: function (respuesta) {
            $("#ResultUsers").empty();
            rta_users = respuesta;
            globalThis;
            console.log(respuesta);
            MostrarUsuarios(respuesta.items);
            document.getElementById("viewusers").setAttribute("hidden", "true");
            document.getElementById("titnew").setAttribute("hidden", "true");
            document.getElementById("formregistro").setAttribute("hidden", "true");
            document.getElementById("ResultUsers").removeAttribute("hidden");
            document.getElementById("newusers").removeAttribute("hidden");
        }
    });
}

function MostrarUsuarios() {
    if (rta_users.length == 0) {
        var nodata = document.createTextNode("No existen datos en la tabla seleccionada");
        $("#ResultUsers").append(nodata);
    }
    else {
        let myTable = "<table border:'2'>";
        let thead = "<thead>";
        thead += "<tr>";
        thead += "<th>" + "Id" + "</th>"
        thead += "<th>" + "Nombre" + "</th>"
        thead += "<th>" + "Identificación" + "</th>"
        thead += "<th>" + "Email" + "</th>"
        thead += "<th>" + "Dirección" + "</th>"
        thead += "<th>" + "Celular" + "</th>"
        thead += "<th>" + "Zona" + "</th>"
        thead += "<th>" + "Tipo_Usuario" + "</th>"
        thead += "<th>" + "Acciones" + "</th>"
        thead += "</tr>";
        thead += "<thead>";
        myTable += thead;
        for (i = 0; i < rta_users.length; i++) {
            myTable += "<tr>";
            myTable += "<td align=center>" + rta_users[i].id + "</td>";
            myTable += "<td align=center>" + rta_users[i].name + "</td>";
            myTable += "<td align=center>" + rta_users[i].identification + "</td>";
            myTable += "<td align=center>" + rta_users[i].email + "</td>";
            myTable += "<td align=center>" + rta_users[i].address + "</td>";
            myTable += "<td align=center>" + rta_users[i].cellPhone + "</td>";
            myTable += "<td align=center>" + rta_users[i].zone + "</td>";
            myTable += "<td align=center>" + rta_users[i].type + "</td>";
            myTable += "<td> <button onclick='ModificarUsuario(" + rta_users[i].id + ")'>Actualizar</button>" + " " +
                "<button onclick='BorrarUsuario(" + rta_users[i].id + ")'>Eliminar</button>";
            myTable += "</tr>";
        }
        myTable += "</table>";
        $("#ResultUsers").append(myTable);
    }
}

function BorrarUsuario(idElemento) {
    let myData = idElemento;
    $.ajax({
        url: "http://129.151.117.220:8003/api/user/" + myData,
        type: "DELETE",
        data: myData,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            $("#ResultUsers").empty();
            alert("Se ha Eliminado el usuario con id: " + idElemento);
            location.reload();
            ConsultarUsuarios();
        }

    });
}

function MostrarFormNuevoUsuario() {
    $("#titnew").html("Crear Nuevo Usuario:");
    $("#BGUser").html("Guardar Usuario");
    document.getElementById("titnew").removeAttribute("hidden");
    document.getElementById("formregistro").removeAttribute("hidden");
    document.getElementById("viewusers").removeAttribute("hidden");
    $("#ResultUsers").empty();
    document.getElementById("newusers").setAttribute("hidden", "true");
}

function ModificarUsuario(idElement) {
    MostrarFormNuevoUsuario();
    $("#titnew").html("Actualizar Datos del Usuario");
    $("#BGUser").html("Actualizar Datos");
    let bot = document.getElementById("BGUser");
    bot.removeAttribute("onclick"); bot.setAttribute("onclick", "ActualizarUsuario()");
    let myData = idElement;
    $.ajax({
        url: "http://129.151.117.220:8003/api/user/" + myData,
        type: "GET",
        data: myData,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            User1 = respuesta;
            console.log(User1);
            $("#iduser").val(User1.id);
            document.getElementById("iduser").removeAttribute("hidden");
            $("#identif").val(User1.identification);
            $("#email").val(User1.email);
            $("#name").val(User1.name);
            $("#password").val(User1.password);
            $("#confirm").val(User1.password);
            $("#address").val(User1.address);
            $("#cel").val(User1.cellPhone);
            $("#zona").val(User1.zone);
            $("#tipo").val(User1.type);
            var Cumpleaños = new Date(User1.birthtDay).toISOString().slice(0, 10);
            $("#birthday").val(Cumpleaños);
        }
    });

}

function ActualizarUsuario() {
    validarvacio($("#name").val(), "Debe ingresar un nombre");
    validarvacio($("#email").val(), "Debe ingresar un e-mail");
    validarvacio($("#password").val(), "Debe ingresar una contraseña");
    validarvacio($("#confirm").val(), "Por favor confirme su contraseña");
    validarconfirm($("#password").val(), $("#confirm").val());
    document.getElementById("iduser").removeAttribute("hidden");
    var MesCumpleaños = new Date($("#birthday").val()).getMonth();
    let myData = {
        id: parseInt($("#iduser").val()),
        identification: $("#identif").val(),
        name: $("#name").val(),
        address: $("#address").val(),
        cellPhone: $("#cel").val(),
        email: $("#email").val().toLowerCase(),
        password: $("#password").val(),
        zone: $("#zona").val(),
        type: $("#tipo").val(),
        birthtDay: $("#birthday").val(),
        monthBirthtDay: MesCumpleaños + 1,
    };
    let dataToSend = JSON.stringify(myData);
    console.log(dataToSend);
    $.ajax({
        url: "http://129.151.117.220:8003/api/user/update",
        type: "PUT",
        data: dataToSend,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            $("#name").val("");
            $("#email").val("");
            $("#password").val("");
            $("#confirm").val("");
            $("#address").val("");
            $("#zona").val("");
            $("#cel").val("");
            $("#identif").val("");
            $("#birthday").val("");
            alert("se han actualizado los datos del Usuario");
            document.getElementById("iduser").setAttribute("hidden", "true");
            ConsultarUsuarios();
        }
    });
    let bot = document.getElementById("BGUser");
    bot.removeAttribute("onclick"); bot.setAttribute("onclick", "guardarUsuario()");
}

//Productos
function ValidarProdDuplicado(reference, callbackFunction) {
    $.ajax({
        url: "http://129.151.117.220:8003/api/cookware/all",
        type: "GET",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            callbackFunction(reference, respuesta);
        }
    });
}

function ListaProductos(reference, respuesta) {

    listproducts = [];
    for (i = 0; i < respuesta.length; i++) {
        listproducts.push(respuesta[i].reference);
    }
    console.log(listproducts);
    p = reference;
    console.log(p);
    if (listproducts.includes(p) && p != null) {
        alert("La referencia " + p + " ya se encuentra registrada");
        throw exit;
    } else {
        NuevoProducto();
    }
}


function NuevoProducto() {
    validarvacio($("#ref").val(), "Debe ingresar la referencia del producto");
    validarvacio($("#desc").val(), "Debe ingresar una descripcion");
    validarvacio($("#categ").val(), "Debe ingresar una categoria");
    validarvacio($("#price").val(), "Debe ingresar el precio de venta");

    let myData = {
        reference: $("#ref").val().toUpperCase(),
        brand: $("#brand").val(),
        category: $("#categ").val(),
        materiales: $("#materiales").val(),
        dimensiones: $("#dimensiones").val(),
        description: $("#desc").val().toLowerCase(),
        availability: $("#available").val(),
        price: $("#price").val(),
        quantity: $("#Q").val(),
        photography: $("#photography").val(),
    };
    let dataToSend = JSON.stringify(myData);
    console.log(dataToSend);
    $.ajax({
        url: "http://129.151.117.220:8003/api/cookware/new",
        type: "POST",
        data: dataToSend,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            $("#ref").val("");
            $("#brand").val("");
            $("#categ").val("");
            $("#materiales").val("");
            $("#dimensiones").val("");
            $("#desc").val("");
            $("#price").val("");
            $("#Q").val("");
            $("#photography").val(""),
                alert("se ha guardado el Producto");
        }
    });

}

function guardarProducto() {
    ValidarDuplicado($("#ref").val().toUpperCase(), ListaProductos);
    ConsultarProductos();
}

function ConsultarProductos() {
    $.ajax({
        url: "http://129.151.117.220:8003/api/cookware/all",
        type: "GET",
        datatype: "JSON",
        success: function (respuesta) {
            $("#ResultProducts").empty();
            rta_products = respuesta;
            globalThis;
            console.log(respuesta);
            MostrarProductos(respuesta.items);
            document.getElementById("viewproducts").setAttribute("hidden", "true");
            document.getElementById("titnewp").setAttribute("hidden", "true");
            document.getElementById("formregistrop").setAttribute("hidden", "true");
            document.getElementById("ResultProducts").removeAttribute("hidden");
            document.getElementById("newproducts").removeAttribute("hidden");
            Verificarlogin(sessionStorage.getItem("id"), sessionStorage.getItem("role"));
        }
    });
}

function MostrarProductos() {
    if (rta_products.length == 0) {
        var nodata = document.createTextNode("No existen datos en la tabla seleccionada");
        $("#ResultProducts").append(nodata);
    }
    else {
        let myTable = "<table border:'2'>";
        let thead = "<thead>";
        thead += "<tr>";
        thead += "<th>" + "Ref" + "</th>"
        thead += "<th>" + "Descripcion" + "</th>"
        thead += "<th>" + "Brand" + "</th>"
        thead += "<th>" + "Categoría" + "</th>"
        thead += "<th>" + "Precio" + "</th>"
        thead += "<th>" + "Cantidad" + "</th>"
        thead += "<th>" + "Dimensiones" + "</th>"
        thead += "<th>" + "Disponible" + "</th>"
        thead += "<th class='ADM'>" + "Acciones" + "</th>"
        thead += "</tr>";
        thead += "<thead>";
        myTable += thead;
        for (i = 0; i < rta_products.length; i++) {
            myTable += "<tr>";
            myTable += "<td align=center>" + rta_products[i].reference + "</td>";
            myTable += "<td align=center>" + rta_products[i].description + "</td>";
            myTable += "<td align=center>" + rta_products[i].brand + "</td>";
            myTable += "<td align=center>" + rta_products[i].category + "</td>";
            myTable += "<td align=center>" + rta_products[i].price + "</td>";
            myTable += "<td align=center>" + rta_products[i].quantity + "</td>";
            myTable += "<td align=center>" + rta_products[i].dimensiones + "</td>";
            myTable += "<td align=center>" + rta_products[i].availability + "</td>";
            myTable += "<td> <button class='ADM' onclick='ModificarProducto(" + (i + 1) + ")'>Actualizar</button>" + " " +
                "<button class='ADM' onclick='BorrarProducto(" + (i + 1) + ")'>Eliminar</button>";
            myTable += "</tr>";
        }
        myTable += "</table>";
        $("#ResultProducts").append(myTable);
    }
}

function BorrarProducto(numrow) {

    let fila = document.getElementsByTagName("table")[0].getElementsByTagName("tr")[numrow].getElementsByTagName("td")[0];
    let myData = fila.firstChild.nodeValue;

    $.ajax({
        url: "http://129.151.117.220:8003/api/cookware/" + myData,
        type: "DELETE",
        data: myData,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            $("#ResultProducts").empty();
            alert("Se ha Eliminado el producto " + celda);
            ConsultarProductos();
        }

    });
}

function MostrarFormNuevoProducto() {
    $("#titnewp").html("Crear Nuevo Producto:");
    $("#BGProduct").html("Guardar Producto");
    document.getElementById("titnewp").removeAttribute("hidden");
    document.getElementById("formregistrop").removeAttribute("hidden");
    document.getElementById("viewproducts").removeAttribute("hidden");
    $("#ResultProducts").empty();
    document.getElementById("newproducts").setAttribute("hidden", "true");
}

function ModificarProducto(numrow) {

    let fila = document.getElementsByTagName("table")[0].getElementsByTagName("tr")[numrow].getElementsByTagName("td")[0];
    let myData = fila.firstChild.nodeValue;

    MostrarFormNuevoProducto();
    $("#titnewp").html("Actualizar Datos del Producto");
    $("#BGProduct").html("Actualizar Datos");
    let bot = document.getElementById("BGProduct");
    bot.removeAttribute("onclick"); bot.setAttribute("onclick", "ActualizarProducto()");


    $.ajax({
        url: "http://129.151.117.220:8003/api/cookware/" + myData,
        type: "GET",
        data: myData,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            ref1 = respuesta;
            console.log(ref1);
            $("#ref").val(ref1.reference);
            $("#brand").val(ref1.brand);
            $("#categ").val(ref1.category);
            $("#desc").val(ref1.description);
            $("#materiales").val(ref1.materiales);
            $("#dimensiones").val(ref1.dimensiones);
            $("#Q").val(ref1.quantity);
            $("#price").val(ref1.price);
            $("#photography").val(ref1.photography);
            $("#available").val(String(ref1.availability));
        }
    });

}

function ActualizarProducto() {
    validarvacio($("#ref").val(), "Debe ingresar la referencia del producto");
    validarvacio($("#desc").val(), "Debe ingresar una descripcion");
    validarvacio($("#categ").val(), "Debe ingresar una categoria");
    validarvacio($("#price").val(), "Debe ingresar el precio de venta");

    let myData = {
        reference: $("#ref").val().toUpperCase(),
        brand: $("#brand").val(),
        category: $("#categ").val(),
        materiales: $("#materiales").val(),
        dimensiones: $("#dimensiones").val(),
        description: $("#desc").val().toLowerCase(),
        availability: $("#available").val(),
        price: $("#price").val(),
        quantity: $("#Q").val(),
        photography: $("#photography").val(),
    };
    let dataToSend = JSON.stringify(myData);
    console.log(dataToSend);
    $.ajax({
        url: "http://129.151.117.220:8003/api/cookware/update",
        type: "PUT",
        data: dataToSend,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            $("#ref").val("");
            $("#brand").val("");
            $("#categ").val("");
            $("#materiales").val("");
            $("#dimensiones").val("");
            $("#desc").val("");
            $("#price").val("");
            $("#Q").val("");
            $("#photography").val(""),
                alert("se han actualizado los datos del Producto");
            ConsultarProductos();
        }
    });
    let bot = document.getElementById("BGProduct");
    bot.removeAttribute("onclick"); bot.setAttribute("onclick", "guardarProducto()");
}

function ListaProductos() {
    $.ajax({
        url: "http://129.151.117.220:8003/api/cookware/all",
        type: "GET",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            const $listprod = $("#itemOrder");
            for (i = 0; i < respuesta.length; i++) {
                $listprod.append($("<option>", { value: respuesta[i].reference, text: respuesta[i].reference + "-" + respuesta[i].description }));
            }
        }
    });
}

//Pedidos
function NewOrder() {
    let id = sessionStorage.getItem("id");
    $.ajax({
        url: "http://129.151.117.220:8003/api/user/" + id,
        type: "GET",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            $("#salesman").val(respuesta.name);
            $("#zoneped").val(respuesta.zone);
        }
    });
    let fecha = new Date();
    $("#regday").val(fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate());
    ListaProductos();
    if (sessionStorage.getItem("pedido") !== " " && sessionStorage.getItem("pedido") !== null) {
        objeto = JSON.parse(sessionStorage.getItem("pedido"));
        const $carrito = $("#ITEMSPEDIDO");
        for (i=0;i<objeto.length;i++){ 
            array2={}
            ListaString = objeto[i].datos;
            $carrito.append($("<li>", { text: "Producto: " + ListaString.Producto + ", Cantidad: " + ListaString.Cantidad + ", PrecioUd: " + ListaString.PrecioUd}));
            array2.id=objeto[i].id;
            array2.datos={
                Producto: ListaString.Producto,
                Cantidad: ListaString.Cantidad,
                PrecioUd: ListaString.PrecioUd
            };
            listapedidos.push(JSON.stringify(array2));
        };
        $("#totalped").html("Total Pedido: "+ numeral(parseInt(sessionStorage.getItem("totalpedido"))).format('$0,0'));
        array.id= JSON.parse(sessionStorage.getItem("pedido")).length;
        
    }

}

function ConsultarPedidos() {
    $.ajax({
        url: "http://129.151.117.220:8003/api/order/all",
        type: "GET",
        datatype: "JSON",
        success: function (respuesta) {
            $("#ResultOrders").empty();
            rta_orders = respuesta;
            globalThis;
            console.log(respuesta);
            MostrarOrdenes(respuesta.items);
            document.getElementById("vieworders").setAttribute("hidden", "true");
            document.getElementById("AddItems").setAttribute("hidden", "true");
            document.getElementById("formregorder").setAttribute("hidden", "true");
            document.getElementById("ResultOrders").removeAttribute("hidden");
            document.getElementById("neworder").removeAttribute("hidden");
            Verificarlogin(sessionStorage.getItem("id"), sessionStorage.getItem("role"));
        }
    });
}

function MostrarOrdenes() {
    if (rta_orders.length == 0) {
        var nodata = document.createTextNode("No existen datos en la tabla seleccionada");
        $("#ResultOrders").append(nodata);
    }
    else {
        let myTable = "<table border:'2'>";
        let thead = "<thead>";
        thead += "<tr>";
        thead += "<th>" + "ID Pedido" + "</th>"
        thead += "<th>" + "Fecha Pedido" + "</th>"
        thead += "<th>" + "Status" + "</th>"
        thead += "<th>" + "Vendedor" + "</th>"
        thead += "<th>" + "Zona" + "</th>"
        thead += "<th class='ADM'>" + "Acciones" + "</th>"
        thead += "</tr>";
        thead += "<thead>";
        myTable += thead;
        for (i = 0; i < rta_orders.length; i++) {
            myTable += "<tr>";
            myTable += "<td align=center>" + rta_orders[i].id + "</td>";
            var FechaPedido = new Date(rta_orders[i].registerDay).toISOString().slice(0, 10);
            myTable += "<td align=center>" + FechaPedido + "</td>";
            myTable += "<td align=center>" + rta_orders[i].status + "</td>";
            myTable += "<td align=center>" + rta_orders[i].salesMan.name + "</td>";
            myTable += "<td align=center>" + rta_orders[i].salesMan.zone + "</td>";
            myTable += "<td> <button class='COORD' onclick='DetallesPedido(" + rta_orders[i].id + ")'>Ver detalles</button>" + " " +
                "<button class='ADM' onclick='BorrarPedido(" + rta_orders[i].id + ")'>Eliminar</button>";
            if(rta_orders[i].status=="Pendiente"){
                myTable += "<td> <button class='COORD buttaproval' onclick='AprobarPedido(" + rta_orders[i].id + ")'>Aprobar</button>" + " " +
                    "<button class='COORD buttreject' onclick='RechazarPedido(" + rta_orders[i].id + ")'>Rechazar</button>";
            }   
            myTable += "</tr>";
        }
        myTable += "</table>";
        $("#ResultOrders").append(myTable);
    }
}

function DetallesPedido(id) {
    $.ajax({
        url: "http://129.151.117.220:8003/api/order/" + id,
        type: "GET",
        datatype: "JSON",
        success: function (respuesta) {
            $("#ResultOrders").empty();
            console.log(respuesta);
            MostrarDetalleOrden(respuesta);
            document.getElementById("vieworders").removeAttribute("hidden");
        }
    });
}

function MostrarDetalleOrden(respuesta) {
    let myTableD = "<table border:'2'>";
    let thead = "<thead>";
    thead += "<tr>";
    thead += "<th>" + "ID Pedido" + "</th>"
    thead += "<th>" + "Fecha Pedido" + "</th>"
    thead += "<th>" + "Referencia" + "</th>"
    thead += "<th>" + "Cantidad" + "</th>"
    thead += "<th>" + "Precio" + "</th>"
    thead += "<th>" + "Subtotal" + "</th>"
    thead += "</tr>";
    thead += "<thead>";
    myTableD += thead;
    myTableD += "<tr>";
    preciototal=0;
    for (var key in respuesta.quantities) {
        myTableD += "<td align=center>" + respuesta.id + "</td>";
        var FechaPedido = new Date(respuesta.registerDay).toISOString().slice(0, 10);
        myTableD += "<td align=center>" + FechaPedido + "</td>";
        myTableD += "<td align=center>" + key + "</td>";
        myTableD += "<td align=center>" + respuesta.quantities[key] + "</td>";
        if (respuesta.products[key].reference = key) {
            precioUd = respuesta.products[key].price;
            myTableD += "<td align=center>" + numeral(precioUd).format('$0,0') + "</td>";
        }
        subtotal=  respuesta.quantities[key] * precioUd;
        preciototal += subtotal;
        myTableD += "<td align=center>" + numeral(subtotal).format('$0,0') + "</td>";
        myTableD += "</tr>";
    };
    let tfoot = "<tfoot>";
    tfoot += "<tr>";
    tfoot += "<th>" + "</th>"
    tfoot += "<th>" + "</th>"
    tfoot += "<th>" + "</th>"
    tfoot += "<th>" + "</th>"
    tfoot += "<th>" + "TOTAL PEDIDO" + "</th>"
    tfoot += "<th id='totalpedido'>" + numeral(preciototal).format('$0,0') + "</th>"
    tfoot += "</tr>";
    tfoot += "<thead>";
    myTableD += tfoot;
    myTableD += "</table>";
    $("#ResultOrders").append(myTableD);
}

function MostrarFormNuevoPedido() {
    document.getElementById("AddItems").removeAttribute("hidden");
    document.getElementById("formregorder").removeAttribute("hidden");
    document.getElementById("vieworders").removeAttribute("hidden");
    document.getElementById("ResultOrders").setAttribute("hidden", "true");
    document.getElementById("neworder").setAttribute("hidden", "true");
}

function BorrarPedido(idElemento) {
    let myData = idElemento;
    $.ajax({
        url: "http://129.151.117.220:8003/api/order/" + myData,
        type: "DELETE",
        data: myData,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            $("#ResultOrders").empty();
            alert("Se ha Eliminado el pedido número " + idElemento);
            ConsultarPedidos();
        }
    });
}

listapedidos = [];
let array={};
array.id=0;
TotalPedido=0;

function AgregaralCarro() {

    let myData = $("#itemOrder").val().substr(0, 6);
    $.ajax({
        url: "http://129.151.117.220:8003/api/cookware/" + myData,
        type: "GET",
        data: myData,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            const $carrito = $("#ITEMSPEDIDO");
            var lineapedido = "Producto: " + respuesta.reference + ", Cantidad: " + $("#QOrder").val() + ", PrecioUd: " + numeral(respuesta.price).format('$0,0');
            $carrito.append($("<li>", { text: lineapedido }));
            if(array.id == 0){
                array.id += 1;
                TotalPedido+=($("#QOrder").val()*respuesta.price);
            }else{
                array.id= JSON.parse(sessionStorage.getItem("pedido")).length + 1;
                TotalPedido=($("#QOrder").val()*respuesta.price)+parseInt(sessionStorage.getItem("totalpedido"));
            }
            array.datos={
                Producto: respuesta.reference,
                Cantidad: $("#QOrder").val(),
                PrecioUd: numeral(respuesta.price).format('$0,0')
            };
            listapedidos.push(JSON.stringify(array));
            sessionStorage.setItem("totalpedido", TotalPedido);
            sessionStorage.setItem("pedido", "["+listapedidos+"]");
            console.log(sessionStorage.getItem("pedido"));
            $("#totalped").html("Total Pedido: "+numeral(TotalPedido).format('$0,0'));
        }
    });
}

function AprobarPedido(idElemento){
    let myData = idElemento;
    $.ajax({
        url: "http://129.151.117.220:8003/api/order/" + myData,
        type: "GET",
        data: myData,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            let datos= {
                id: respuesta.id,
                registerDay: respuesta.registerDay,
                status: "Aprobada",
                salesMan: respuesta.salesMan,
                products: respuesta.products,
                quantities: respuesta.quantities,
            };
            MyDataPUT=JSON.stringify(datos);
            $.ajax({
                url: "http://129.151.117.220:8003/api/order/update",
                type: "PUT",
                data: MyDataPUT,
                contentType: "application/JSON",
                datatype: "JSON",
                success: function (respuesta) {
                    console.log(respuesta);
                    alert("El pedido ha sido aprobado");
                    location.reload();
                    ConsultarPedidos();
                }
            });            
        }
    });
}

function RechazarPedido(idElemento){
    let myData = idElemento;
    $.ajax({
        url: "http://129.151.117.220:8003/api/order/" + myData,
        type: "GET",
        data: myData,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            let datos= {
                id: respuesta.id,
                registerDay: respuesta.registerDay,
                status: "Rechazada",
                salesMan: respuesta.salesMan,
                products: respuesta.products,
                quantities: respuesta.quantities,
            };
            MyDataPUT=JSON.stringify(datos);
            $.ajax({
                url: "http://129.151.117.220:8003/api/order/update",
                type: "PUT",
                data: MyDataPUT,
                contentType: "application/JSON",
                datatype: "JSON",
                success: function (respuesta) {
                    console.log(respuesta);
                    alert("El pedido ha sido rechazado");
                    location.reload();
                    ConsultarPedidos();
                }
            });            
        }
    });
}

function GuardarPedido() {
    validarvacio($("#ITEMSPEDIDO").text(), "Debe ingresar por lo menos un item");
    objeto = JSON.parse(sessionStorage.getItem("pedido"));
    P={}; Q={};
    for (i=0;i<objeto.length;i++){ 
        Datosref = objeto[i].datos;
        jQuery.extend({
            getValues: function(url) {
            var producto=null;
            $.ajax({
                url: "http://129.151.117.220:8003/api/cookware/"+Datosref.Producto,
                type: "GET",
                datatype: "JSON",
                async: false,
                success: function (respuesta) {
                    console.log(respuesta);
                    producto=respuesta;
                }    
            });    
            return producto
            }
        });
        P[Datosref.Producto]=$.getValues("http://129.151.117.220:8003/api/cookware/"+Datosref.Producto);
        Q[Datosref.Producto]=parseInt(Datosref.Cantidad);
    };

    IdVendedor = sessionStorage.getItem("id");
    V={};
    jQuery.extend({
        getValues: function(url) {
            var vendedor=null;
            $.ajax({
                url: "http://129.151.117.220:8003/api/user/"+IdVendedor,
                type: "GET",
                datatype: "JSON",
                async: false,
                success: function (respuesta) {
                    console.log(respuesta);
                    vendedor=respuesta;
                }    
            });    
            return vendedor
            }
        });
    V=$.getValues("http://129.151.117.220:8003/api/user/"+IdVendedor);
    
    let myData = {
        registerDay: $("#regday").val(),
        status: $("#status").val(),
        salesMan: V,
        products: P,
        quantities: Q,
    };
    let dataToSend = JSON.stringify(myData);
    console.log(dataToSend);
    $.ajax({
        url: "http://129.151.117.220:8003/api/order/new",
        type: "POST",
        data: dataToSend,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            alert("se ha guardado el Pedido");
            sessionStorage.setItem("pedido", " ");
            location.reload();
        }
    });

}