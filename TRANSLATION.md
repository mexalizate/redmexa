# Internationalization

The goal of internationalization is to allow a single web application to offer its content in
several languages and associated formats.

Internationalization comes as a first step before localization:

1. Internationalization is the act of specifying parts of the application that must be translated or adapted 
   depending on language or culture. This is done by the developers.
2. Thanks to that first part, text to be translated can be automatically extracted in a localization file that can be 
   sent to translators.

At runtime, everytime the application runs into text marked for translation, it automatically find the corresponding 
translations in the files provided by the translators and can show text in the correct language.

## Specify text for translation

Developers must first identify and specify all character strings that must be translated.

Only visible text should be marked for translation: character strings used as internal ids or database values should
be marked.

For instance, in this code fragment:

```python
class Role(ExportModelOperationsMixin("role"), PermissionsMixin, AbstractBaseUser):
    PERSON_ROLE = "P"
    CLIENT_ROLE = "C"

    ROLE_TYPE = [(PERSON_ROLE, _("Personne")), (CLIENT_ROLE, _("Client"))]

    objects = RoleManager()

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    type = models.CharField(
        _("type de rôle"),
        max_length=1,
        choices=ROLE_TYPE,
        editable=False,
        blank=False,
        null=False,
    )

    USERNAME_FIELD = "id"
```

The strings `"role"`, `"P"`, `"C"` and `"id"` are purely internal strings that will never be shown to the end user.
They should *not* be marked for translation, unlike chains like `"Personne"` or `"type de rôle"`

### In Python code

#### Generic case

In Python, the following is enough for most translations:

```python
from django.utils.translation import gettext as _
```

Then the `_` function can be used to identify strings for translations, as in:

```python
return self.redirect_to_event(
    message=_(
        "Merci de nous avoir signalé votre participation à cet événenement."
    ),
    level=messages.SUCCESS,
)
```

Note that you can either use the original name `gettext` or the short form `_`, but that any other name will not 
work: the gettext binary used for extracting texts to translate only recognize these fixed forms.

#### Strings in module or class scope

One frequent issue is character strings defined in module scope (outside of any class or function) or in class scope 
(defined in a class body but out of a method definition). The code in these scopes is always executed as soon as the 
module is imported: it means we might not have access to the translation files, and that the translation cannot 
adapt to specific users.

Django provides a solution for these cases with a lazily executed version of gettext:

```python
from django.utils.translation import gettext_lazy as _
```

With this version of gettext, the string will only be translated when it is evaluated as a string.

In the case you need both `gettext` and `gettext_lazy`, you can import them both with their original names, or use 
`_` for one of them.

#### In templates

In templates, the template library `i18n` must first be loaded:

```html
{% load i18n %}
```

The `translate` template tag may be used for short labels:

```html
<title>{% translate "This is the title." %}</title>
```

The `blocktranslate` block template is more efficient for longer texts or when there are references to variables:

```html
{% blocktranslate %}
  This string will have {{ value }} inside.
{% endblocktranslate %}
```

If the block of text to mark for translations use complex expressions (like access to attributes, or filters), it is 
required to use placeholder variables, as in:

```html
{% blocktranslate with amount=article.price %}
That will cost $ {{ amount }}.
{% endblocktranslate %}

{% blocktranslate with myvar=value|filter %}
This will have {{ myvar }} inside.
{% endblocktranslate %}
```

#### Marking part of a string for translation with f-strings

Whenever only part of a string should be translated (because it is surrounded by HTML tags for instance), f-strings 
may be used:

```python
text = "<strong>Attention à la valeur de ce champ</strong>"
```

Might be marked with translation like this:

```python
text = f"<strong>{_('Attention à la valeur de ce champ')}</strong>"
```

There are however limitations with f-strings: different string separators have to be used between the braces, and 
the outside separator or backslashes cannot appear inside the braces.

For instance that string might be harder to translate because there is a single quote in the text:

```python
# original text
text = "<strong>Répondre à l'appel</strong>

# this does not work because backslashes cannot be used inside the braces
text = f"<strong>{_('Répondre à l\'appel')}</strong>"

# this does not work because the external separator cannot appear inside the braces
text = f'<strong>{_("Répondre à l'appel")}</strong>'

# this work, thanks to the triple quotes, but it is cumbersome
text = f"""<strong>{_("Répondre à l'appel")}</strong>"""

# this is an alternative solution that will work in every case
text = _("Répondre à l'appel")
text = f"<strong>{text}</strong>"
```

### In javascript code

Import the pseudo-module `gettext` to get access to the translation function:

```javascript
import _ from "gettext";
```

As in Python, you can only use `gettext` or the short value `_` to name that function: any other value will not be 
recognized by the gettext binary used to extract translation files.

After importing, you can then mark any string for translation:

```javascript
{
  label: _("Ma recherche"), 
  options: options
}
```

Note that in JSX context you will most likely need additional curly braces`{}` as in:

```javascript
const HomeFooter = () => {
  return (
    <StyledFooter>
      <h2>{_("Passez&nbsp;à l'action&nbsp;!")}</h2>
      <Spacer size="2rem" />
      <Button link to="/inscription/" color="tertiary">
        {_("S'inscrire")}
      </Button>
      <Spacer size="1rem" />
      <Button link to="/connexion/" color="primary">
        {_("Se connecter")}
      </Button>
    </StyledFooter>
  );
};
```