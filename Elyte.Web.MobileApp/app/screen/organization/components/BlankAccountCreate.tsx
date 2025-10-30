import { ElBody, ElButton, ElContainer, ElInput, H3 } from 'el/components';
import { Flex } from 'native-base';
import React, { useState } from 'react';

export default function BlankAccountCreate({ onCreatePlayer }) {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const handleCreatePlayer = async () => {
        setLoading(true);
        await onCreatePlayer({ name });
        setLoading(false);
    };

    return (
        <ElContainer>
            <Flex align="center">
                <H3>Create Player</H3>
            </Flex>
            <ElBody textAlign="center" mt={1}>
                Create a blank account for one of your team mates that doesnt have an ELYTE account
            </ElBody>
            <ElInput
                name="name"
                placeholder="Name"
                onChangeText={setName}
                inputAccessoryViewID="hideAccessory"
            />
            <ElButton disabled={!name} loading={loading} onPress={handleCreatePlayer}>
                Create Player
            </ElButton>
        </ElContainer>
    );
}
