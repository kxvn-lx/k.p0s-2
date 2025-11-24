import { View, ViewProps } from "react-native";

// ----- Shared layout wrapper (composite, not a UI primitive) -----
export default function Layout({ children, style, ...rest }: ViewProps) {
    return (
        <View style={[{ flex: 1, padding: 16 }, style]} {...rest}>
            {children}
        </View>
    );
}
