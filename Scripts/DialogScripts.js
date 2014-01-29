// Build a common window level object to avoid polluting the namespace
// Depending on how easily this needs to be maintained the names could
// be shortened to make the calls a little shorter. I chose to go with
// a more verbose naming structure just so it would be easy to follow.
var wObjs = {
    // Let's set up reference points for things we'll need.
    // Due to the nature of JavaScript's first come first
    // serve prototyping nature, these will need to be set
    // in our init function
    Dialog: null,
    Username: null,
    Password: null,
    DialogValid: null,
    DialogNotValid: null,
    DialogError: null,
    DialogUserName: null,
    DialogPassword: null,

    // Let's create an initialization method
    // that will take care of getting everything
    // prepped. Keep in mind we are not treating
    // this as an "instance" per se, but each
    // method will behave statically given
    // certain expectations and preconditions.
    Init: function () {
        // So set the element references already.
        // What are you waiting for? Oh yah. That.
        this.Dialog = $('#dialog');
        this.Username = $('#UserName');
        this.Password = $('#Password');
        this.DialogValid = $('.dialogValid');
        this.DialogNotValid = $('.dialogNotValid');
        this.DialogError = $('.dialogError');
        this.DialogUserName = $('.dialogUserName');
        this.DialogPassword = $('.dialogPassword');

        // Set up the submit button and focus the cursor
        $('input:submit', '.letMeIn').button();
        wObjs.Username.focus();

        // Attach the click event to perform validation
        $('input:submit').click(this.ValidateCredentials);

        this.Dialog.dialog({
            autoOpen: false,
            modal: true,
            width: 530,
            height: 350,
            resizable: false,
        });

        this.HideDivs();
    },

    // We know we'll need to hide/show various
    // blocks depending on the current action,
    // so let's put in a global hide so it's a
    // little easier to show only 1 at a time.
    HideDivs: function () {
        this.DialogValid.hide();
        this.DialogNotValid.hide();
        this.DialogError.hide();
        this.DialogUserName.hide();
        this.DialogPassword.hide();
    },

    // This is not really a good function. A 
    // good function should do only one thing,
    // and it should do that thing well. This
    // function is currently doing more than
    // just SetTitle. However, given the scope
    // of this project it's simpler to leave
    // it as is rather than trying to push all
    // of these items into their own methods
    // and then have a process method that 
    // knows what to do with it all.
    SetTitle: function (title, element) {
        this.HideDivs();
        this.Dialog.dialog('option', 'title', title);
        element.show();
        this.Dialog.dialog('open');
        this.Dialog.css('width', '520px');
    },

    // This was originally sitting on its own
    // but I decided that it was just clutter
    // to the window namespace so I moved it
    // here. In a larger project this becomes
    // important as more and more script files
    // with potential name collisions are
    // included in common files.
    ShowDialog: function (isValid, error) {
        if (error != null) {
            this.SetTitle('Sorry, the server soiled itself.', wObjs.DialogError);
        }
        else if (isValid) {
            this.SetTitle('Those credentials are valid.', wObjs.DialogValid);
        }
        else {
            this.SetTitle('Those credentials are bogus', wObjs.DialogNotValid);
        }
    },

    // This is the primary AJAX call.
    ValidateCredentials: function(e) {
        // Since we don't want a page post and this is
        // associated with a click event, we need to 
        // suppress default behavior.
        e.preventDefault();

        // Ordinarily this kind of validation would be
        // handled by a fancy-schmancy validator either
        // the built-in validation for the model (which
        // is my preference) or maybe jQuery validator
        // which is also available. I chose to do it
        // manually just because I didn't really have
        // any instruction not to.
        if ($.trim(wObjs.Username.val()) == '') {
            wObjs.SetTitle('What? No username? Surely you jest.', wObjs.DialogUserName);
            return;
        }

        if ($.trim(wObjs.Password.val()) == '') {
            wObjs.SetTitle('A blank password? Not on our system.', wObjs.DialogPassword);
            return;
        }

        // Finally, the AJAX call. Gather the data
        // and send the model up to the controller.
        // Response will expect a "like" model to
        // be returned. In either case, success and 
        // error will both cause a dialog to be
        // shown to the user
        $.ajax({
            type: 'POST',
            url: '/Login/ValidateCredentials',
            dataType: 'json',
            data: JSON.stringify({
                'UserName': wObjs.Username.val(),
                'Password': wObjs.Password.val(),
                'IsValid': false
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (response, status, xhr) { wObjs.ShowDialog(response.IsValid, null); },
            error: function (xhr, status, error) { wObjs.ShowDialog(false, error); } //,
        });
    }
};