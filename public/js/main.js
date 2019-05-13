$(document).ready(function () {
    // alert("1aaaas");

    // $('.alert').fadeOut(2000);
    $('.alert').delay(2000).animate({"right": "-500px"}, 1500);


    $('.delete-art-btn').on('click', function (e) {
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/articles/' + id,
            success: function (responce) {
                alert('Deleting article?');
                window.location.href = '/';
            },
            error: function (err) {
                console.log(err);
            }
        });
    });


    $("#success-alert").fadeTo(2000, 500).slideUp(500, function () {
        $("#success-alert").slideUp(500);
    });

});