# feed2
This feed generator is heavily inspired by [feed][jpmonette],
so much cudos to the author of that module.

So why creating yet anonther feed generator?

  1. [feed][jpmonette] doesn't adhere fully to the RSS standard. It's hard
     (impossible?) to add arbitrary elements with a corresponding XML
     namespace.
  2. [feed][jpmonette] is hard (impossible?) to extend

So the intention of this module is to make a generic feed generator that has
good typings, adhere fully to the various standards and is easily extendable.

**Duly note:** this module is in its infancy

[jpmonette]: https://github.com/jpmonette/feed
