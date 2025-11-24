import { View, ViewProps } from "react-native";

// ----- Centered layout primitive -----
type CenteredProps = ViewProps & { children?: React.ReactNode };

export default function Centered({ children, style, ...rest }: CenteredProps) {
    return (
        <View
            style={[{ flex: 1, justifyContent: "center", alignItems: "center" }, style]}
            {...rest}
        >
            {children}
        </View>
    );
}
