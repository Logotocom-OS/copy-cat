package cc.squiddev.cct.js;

import org.teavm.jso.JSObject;
import org.teavm.jso.JSProperty;

/**
 * @see cc.squiddev.cct.stub.BasicFileAttributes
 * @see java.nio.file.attribute.BasicFileAttributes
 */
public interface JsFileAttributes extends JSObject {
    @JSProperty
    double getCreation();

    @JSProperty
    double getModification();

    @JSProperty
    boolean getDirectory();

    @JSProperty
    double getSize();
}
