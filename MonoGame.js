(function ()
{
    if (Object.prototype.__defineGetter__ && !Object.defineProperty)
    {
        Object.defineProperty = function (obj, prop, desc)
        {
            /// <summary>
            ///     Defines a new property directly on an object, or modifies an existing property on an object, and returns the object.
            /// </summary>
            /// <param name="obj" type="Object">
            ///     The object on which to define the property.
            /// </param>
            /// <param name="prop" type="String">
            ///     The name of the property to be defined or modified.
            /// </param>
            /// <param name="desc" type="Object">
            ///     The descriptor for the property being defined or modified.
            /// </param>
            /// <returns type="Object">
            ///     The object
            /// </returns>
            /// <remarks>
            ///     Base on code from http://blogs.msdn.com/b/ie/archive/2010/09/07/transitioning-existing-code-to-the-es5-getter-setter-apis.aspx
            ///     NOTE: Any code that wishes to use getters/setters should check for Object.defineProperty before doing so. All this code does is convert the legacy way to the new way, but the legacy way must exists. (If the legacy way does not exists the mapping doesn't happen so you only need to check the new way.)
            /// </remarks>
            if ("get" in desc)
            {
                obj.__defineGetter__(prop, desc.get);
            }
            if ("set" in desc)
            {
                obj.__defineSetter__(prop, desc.set);
            }
            return obj;
        }
    }
})();