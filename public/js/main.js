$(document).ready(function(){
    // alert("1aaaas");

    // $('.alert').alert('close', 2000);


    $('.delete-art-btn').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/articles/'+id,
            success: function (responce) {
                alert('Deleting article?');
                window.location.href='/';
            },
            error: function (err) {
                console.log(err);
            }
        });
    });

});